import type { CSSProperties, ReactNode } from 'react';
import { useReveal } from '../hooks/useReveal';

interface SectionProps {
    id: string;
    eyebrow: string;
    title: string;
    children: ReactNode;
}

const TRANSITION_STYLE: CSSProperties = {
    transition: 'transform 0.7s ease, opacity 0.7s ease, filter 0.4s ease',
};

export function Section({ id, eyebrow, title, children }: SectionProps) {
    const { ref, visible } = useReveal<HTMLElement>();

    return (
        <section
            id={id}
            ref={ref}
            className={`mx-auto w-full max-w-5xl scroll-mt-24 px-5 py-16 sm:px-8 sm:py-24 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}
            style={TRANSITION_STYLE}
        >
            <div className="mb-10 sm:mb-14">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-accent-mid">
                    {eyebrow}
                </p>
                <h2 className="font-display text-3xl font-bold tracking-tight text-heading sm:text-4xl">
                    {title}
                </h2>
                <div className="mt-4 h-px w-16 bg-gradient-to-r from-accent-start to-transparent" />
            </div>
            {children}
        </section>
    );
}
