import { useEffect, useRef, useState } from 'react';

/**
 * Reveals an element once it scrolls into view using IntersectionObserver.
 * Falls back to immediately visible when the API is unavailable or the user
 * prefers reduced motion, so content is never hidden behind a missing capability.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(rootMargin = '0px 0px -10% 0px') {
    const ref = useRef<T | null>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        const prefersReduced =
            typeof window.matchMedia === 'function' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReduced || typeof IntersectionObserver !== 'function') {
            setVisible(true);
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        setVisible(true);
                        observer.disconnect();
                        break;
                    }
                }
            },
            { rootMargin, threshold: 0.1 },
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, [rootMargin]);

    return { ref, visible };
}
