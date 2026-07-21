import { useEffect, useRef, useState } from 'react';

const NAV_OFFSET = 100;

/**
 * Tracks which section is currently closest to the top of the viewport
 * (with an offset for the fixed nav). Pure scroll-based — no
 * IntersectionObserver timing issues.
 *
 * Returns the ID of the active section, or null when no section is
 * near the top (e.g. hero is in view).
 */
export function useActiveSection(sectionIds: string[]): string | null {
    const [active, setActive] = useState<string | null>(null);

    // Use a ref so the scroll handler always reads the latest array without
    // forcing the effect to re-run on referential changes.
    const idsRef = useRef(sectionIds);
    idsRef.current = sectionIds;

    // Serialise to a stable string dependency so the effect only re-runs
    // when the section list actually changes, not on every render.
    const key = sectionIds.join(',');

    // Cache element references — section IDs are constant, so elements don't change.
    const elementsRef = useRef<Map<string, HTMLElement>>(new Map());

    useEffect(() => {
        // Rebuild cache when section list changes.
        const map = new Map<string, HTMLElement>();
        for (const id of idsRef.current) {
            const el = document.getElementById(id);
            if (el) map.set(id, el);
        }
        elementsRef.current = map;

        let ticking = false;

        const update = () => {
            ticking = false;
            let bestId: string | null = null;
            let bestDist = Infinity;

            for (const [id, el] of elementsRef.current) {
                const rect = el.getBoundingClientRect();
                // Section must be at least partially visible.
                if (rect.bottom < 0 || rect.top > window.innerHeight) continue;
                const dist = Math.abs(rect.top - NAV_OFFSET);
                if (dist < bestDist) {
                    bestDist = dist;
                    bestId = id;
                }
            }
            setActive(bestId);
        };

        const onScroll = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(update);
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        update();

        return () => window.removeEventListener('scroll', onScroll);
    }, [key]);

    return active;
}
