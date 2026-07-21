import { useEffect, useMemo, useState } from 'react';
import { useSettings } from '../context/settings';

const PARTICLE_COUNT = 24;

interface Particle {
    id: number;
    x: number;
    y: number;
    size: number;
    duration: number;
    delay: number;
    opacity: number;
}

function generateParticles(): Particle[] {
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 8 + 6,
        delay: Math.random() * 5,
        opacity: Math.random() * 0.4 + 0.1,
    }));
}

interface Wash {
    id: number;
    color: string;
    colorLight: string;
    size: string;
    drift: string;
    hueSpeed: string;
    hueDelay: string;
}

const WASHES: Wash[] = [
    {
        id: 0,
        color: 'rgba(124, 58, 237, 0.28)',
        colorLight: 'rgba(124, 58, 237, 0.22)',
        size: '160vmax',
        drift: 'wash-1 24s ease-in-out infinite',
        hueSpeed: '18s',
        hueDelay: '0s',
    },
    {
        id: 1,
        color: 'rgba(6, 182, 212, 0.22)',
        colorLight: 'rgba(6, 182, 212, 0.18)',
        size: '140vmax',
        drift: 'wash-2 28s ease-in-out infinite',
        hueSpeed: '22s',
        hueDelay: '-6s',
    },
    {
        id: 2,
        color: 'rgba(99, 102, 241, 0.2)',
        colorLight: 'rgba(99, 102, 241, 0.16)',
        size: '180vmax',
        drift: 'wash-3 20s ease-in-out infinite',
        hueSpeed: '25s',
        hueDelay: '-12s',
    },
    {
        id: 3,
        color: 'rgba(168, 85, 247, 0.18)',
        colorLight: 'rgba(168, 85, 247, 0.15)',
        size: '150vmax',
        drift: 'wash-4 26s ease-in-out infinite',
        hueSpeed: '20s',
        hueDelay: '-4s',
    },
    {
        id: 4,
        color: 'rgba(59, 130, 246, 0.16)',
        colorLight: 'rgba(59, 130, 246, 0.14)',
        size: '170vmax',
        drift: 'wash-5 22s ease-in-out infinite',
        hueSpeed: '30s',
        hueDelay: '-10s',
    },
];

/**
 * Fixed decorative background: animated gradient, drifting color washes, radial
 * glow, and floating particles. Theme-aware via CSS variables.
 * Purely cosmetic and pointer-events-none so it never blocks input.
 * Animations are disabled via prefers-reduced-motion in index.css.
 *
 * Color washes are massive (150vmax+) radial gradients so you never see edges
 * — just soft color that shifts across the viewport. Each wash has its own slow
 * hue-rotate so colors in different areas change independently.
 */
export function Background() {
    const particles = useMemo(generateParticles, []);
    const { theme } = useSettings();
    const isDark = theme === 'dark';
    const [heroVisible, setHeroVisible] = useState(true);

    useEffect(() => {
        if (typeof IntersectionObserver !== 'function') return;
        const hero = document.getElementById('top');
        if (!hero) return;

        const observer = new IntersectionObserver(
            ([entry]) => setHeroVisible(entry.isIntersecting),
            { threshold: 0 },
        );
        observer.observe(hero);
        return () => observer.disconnect();
    }, []);

    return (
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
            <div className="scene-gradient animate-gradient absolute inset-0" />
            <div className="scene-glow absolute inset-0" />
            <div className="color-wash absolute inset-0">
                {WASHES.map((w) => (
                    <div
                        key={w.id}
                        className="color-wash-spot"
                        style={{
                            width: w.size,
                            height: w.size,
                            background: `radial-gradient(circle, ${isDark ? w.color : w.colorLight}, transparent 60%)`,
                            animation: `${w.drift}, wash-hue ${w.hueSpeed} linear ${w.hueDelay} infinite`,
                        }}
                    />
                ))}
            </div>
            {heroVisible && particles.map((p) => (
                <div
                    key={p.id}
                    className="absolute rounded-full"
                    style={{
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        background:
                            p.id % 3 === 0 ? 'rgba(6, 182, 212, 0.6)' : 'rgba(124, 58, 237, 0.5)',
                        boxShadow:
                            p.id % 3 === 0
                                ? '0 0 8px rgba(6, 182, 212, 0.4)'
                                : '0 0 8px rgba(124, 58, 237, 0.3)',
                        animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite`,
                        opacity: p.opacity * (isDark ? 1 : 0.5),
                    }}
                />
            ))}
        </div>
    );
}
