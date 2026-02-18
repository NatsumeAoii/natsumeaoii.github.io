import { useEffect, useState } from 'react';

const PARTICLE_COUNT = 30;

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

function GitHubIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
            <path d="M9 18c-4.51 2-5-2-7-2" />
        </svg>
    );
}

export default function App() {
    const [particles] = useState(generateParticles);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const frame = requestAnimationFrame(() => setMounted(true));
        return () => cancelAnimationFrame(frame);
    }, []);

    return (
        <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-void">
            {/* Animated gradient background */}
            <div
                className="pointer-events-none absolute inset-0 animate-gradient"
                style={{
                    background: 'linear-gradient(-45deg, #050208, #1a0533, #0c1445, #12082e, #050208)',
                    backgroundSize: '400% 400%',
                }}
            />

            {/* Radial glow */}
            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    background: 'radial-gradient(ellipse 60% 50% at 50% 45%, rgba(124, 58, 237, 0.12) 0%, transparent 70%)',
                }}
            />

            {/* Orbiting ring */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div
                    className="animate-orbit rounded-full"
                    style={{
                        width: '6px',
                        height: '6px',
                        background: 'radial-gradient(circle, rgba(168, 139, 250, 0.7), transparent)',
                        boxShadow: '0 0 15px 5px rgba(168, 139, 250, 0.3)',
                    }}
                />
            </div>

            {/* Floating particles */}
            {particles.map((p) => (
                <div
                    key={p.id}
                    className="pointer-events-none absolute rounded-full"
                    style={{
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        background: p.id % 3 === 0
                            ? 'rgba(6, 182, 212, 0.6)'
                            : 'rgba(168, 139, 250, 0.5)',
                        boxShadow: p.id % 3 === 0
                            ? '0 0 8px rgba(6, 182, 212, 0.4)'
                            : '0 0 8px rgba(168, 139, 250, 0.3)',
                        animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite`,
                        opacity: p.opacity,
                    }}
                />
            ))}

            {/* Content Card */}
            <main
                className={`relative z-10 mx-4 w-full max-w-lg transition-all duration-1000 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
                    }`}
            >
                <div
                    className="rounded-2xl border border-white/[0.06] p-8 text-center shadow-2xl backdrop-blur-xl sm:p-12"
                    style={{
                        background: 'linear-gradient(135deg, rgba(22, 16, 42, 0.7), rgba(30, 22, 56, 0.5))',
                        boxShadow: '0 0 80px rgba(124, 58, 237, 0.08), 0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    }}
                >
                    {/* Logo / Avatar */}
                    <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] shadow-lg sm:h-20 sm:w-20">
                        <span className="font-display text-2xl font-bold text-accent-end sm:text-3xl">N</span>
                    </div>

                    {/* Heading */}
                    <h1 className="animate-pulse-glow mb-3 font-display text-4xl font-bold tracking-tight text-heading sm:text-5xl">
                        Coming Soon
                    </h1>

                    {/* Subtitle */}
                    <p className="mb-2 text-sm font-medium tracking-widest text-accent-mid/80 uppercase">
                        NatsumeAoii
                    </p>

                    {/* Description */}
                    <p className="mx-auto mt-6 max-w-xs text-sm leading-relaxed text-muted sm:text-base">
                        Something amazing is being crafted.
                        <br />
                        Stay tuned for the launch.
                    </p>

                    {/* Divider */}
                    <div className="mx-auto my-8 h-px w-20 bg-gradient-to-r from-transparent via-accent-glow/30 to-transparent" />

                    {/* Social Link */}
                    <div className="flex items-center justify-center gap-3">
                        <a
                            href="https://github.com/NatsumeAoii"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-5 py-2.5 text-sm text-muted transition-all duration-300 hover:border-accent-glow/30 hover:bg-white/[0.06] hover:text-heading hover:shadow-lg hover:shadow-accent-start/10"
                            aria-label="Visit NatsumeAoii on GitHub"
                        >
                            <GitHubIcon />
                            <span>GitHub</span>
                        </a>
                    </div>
                </div>

                {/* Footer */}
                <p className="mt-8 text-center text-xs text-muted/50">
                    &copy; {new Date().getFullYear()} NatsumeAoii
                </p>
            </main>
        </div>
    );
}
