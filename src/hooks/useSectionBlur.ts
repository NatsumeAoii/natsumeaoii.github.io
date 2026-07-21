import { useEffect } from 'react';
import { SECTION_IDS } from '../constants';

const MAX_BLUR = 2.5;
const REF_LINE = 100;

/**
 * Applies a progressive blur to sections as their top edge scrolls away from
 * the reference line (just below the fixed nav). The section whose top is
 * closest to the line is crisp; others get up to MAX_BLUR px of blur.
 *
 * Only sets filter (not opacity) to avoid conflicting with the reveal
 * animation's opacity transition in Section.
 */
export function useSectionBlur() {
    useEffect(() => {
        const elements = SECTION_IDS
            .map((id) => document.getElementById(id))
            .filter((el): el is HTMLElement => el !== null);

        if (elements.length === 0) return;

        // Track previous filter values to avoid redundant DOM writes.
        const prevFilters = new Map<HTMLElement, string>();
        for (const el of elements) prevFilters.set(el, '');

        let ticking = false;
        const update = () => {
            ticking = false;
            const vh = window.innerHeight;

            for (const el of elements) {
                const rect = el.getBoundingClientRect();
                if (rect.bottom < -50 || rect.top > vh + 50) {
                    if (prevFilters.get(el) !== '') {
                        el.style.filter = '';
                        prevFilters.set(el, '');
                    }
                    continue;
                }
                if (rect.top <= REF_LINE && rect.bottom >= REF_LINE) {
                    if (prevFilters.get(el) !== '') {
                        el.style.filter = '';
                        prevFilters.set(el, '');
                    }
                    continue;
                }
                const dist = Math.abs(rect.top - REF_LINE);
                const ratio = Math.min(dist / (vh * 0.7), 1);
                const blur = ratio * MAX_BLUR;
                const next = blur > 0.15 ? `blur(${blur.toFixed(1)}px)` : '';
                if (prevFilters.get(el) !== next) {
                    el.style.filter = next;
                    prevFilters.set(el, next);
                }
            }
        };

        const onScroll = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(update);
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        update();

        return () => {
            window.removeEventListener('scroll', onScroll);
            for (const el of elements) el.style.filter = '';
        };
    }, []);
}
