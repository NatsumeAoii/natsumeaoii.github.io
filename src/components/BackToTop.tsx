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
        try {
            window.scrollTo({ top: 0, behavior: 'smooth' });
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
            className="fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-line bg-card/80 text-muted shadow-lg backdrop-blur-sm transition-all hover:border-accent-glow/30 hover:bg-elevate-hover hover:text-accent-end"
        >
            <ArrowUpIcon size={18} />
        </button>
    );
}
