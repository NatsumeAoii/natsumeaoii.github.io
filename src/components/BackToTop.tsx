import { useEffect, useState } from 'react';
import { useSettings } from '../context/settings';
import { ArrowUpIcon } from './icons';

export function BackToTop() {
    const { t } = useSettings();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 400);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleClick = () => {
        const reducedMotion =
            typeof window.matchMedia === 'function' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        try {
            window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
        } catch {
            window.location.hash = '#top';
        }
    };

    if (!visible) return null;

    return (
        <button
            type="button"
            onClick={handleClick}
            aria-label={t.a11y.backToTop}
            className="back-to-top"
        >
            <ArrowUpIcon size={18} />
        </button>
    );
}
