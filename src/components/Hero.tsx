import { useCallback, useEffect, useRef, useState } from 'react';
import { useSettings } from '../context/settings';
import { shared } from '../i18n';
import {
    ArrowDownIcon,
    DownloadIcon,
    GitHubIcon,
    LinkedInIcon,
    MailIcon,
    MapPinIcon,
} from './icons';

function RoleCarousel({ roles, intervalMs = 2600 }: { roles: string[]; intervalMs?: number }) {
    const [index, setIndex] = useState(0);
    const [animate, setAnimate] = useState(true);
    const pausedRef = useRef(false);
    const indexRef = useRef(0);

    // Reset to the first role whenever the list changes (e.g. language switch).
    useEffect(() => {
        setIndex(0);
        indexRef.current = 0;
    }, [roles]);

    const startTimer = useCallback(() => {
        if (roles.length <= 1) return undefined;
        const prefersReduced =
            typeof window.matchMedia === 'function' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        setAnimate(!prefersReduced);
        if (prefersReduced) return undefined;

        return window.setInterval(() => {
            if (!pausedRef.current) {
                indexRef.current = (indexRef.current + 1) % roles.length;
                setIndex(indexRef.current);
            }
        }, intervalMs);
    }, [roles, intervalMs]);

    useEffect(() => {
        const timer = startTimer();
        return () => {
            if (timer !== undefined) window.clearInterval(timer);
        };
    }, [startTimer]);

    const handlePause = useCallback(() => {
        pausedRef.current = true;
    }, []);

    const handleResume = useCallback(() => {
        pausedRef.current = false;
    }, []);

    const safeIndex = Math.min(index, roles.length - 1);

    return (
        <div
            className="relative mb-6 h-7 overflow-hidden text-base font-medium text-accent-end sm:text-lg"
            aria-live="polite"
            onMouseEnter={handlePause}
            onMouseLeave={handleResume}
            onFocus={handlePause}
            onBlur={handleResume}
        >
            <div
                className={animate ? 'transition-transform duration-500 ease-out' : ''}
                style={{ transform: `translateY(-${safeIndex * 1.75}rem)` }}
            >
                {roles.map((r, i) => (
                    <div
                        key={`${r}-${i}`}
                        className="flex h-7 items-center justify-center"
                        aria-hidden={i !== safeIndex}
                    >
                        {r}
                    </div>
                ))}
            </div>
        </div>
    );
}

export function Hero() {
    const { t } = useSettings();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const frame = requestAnimationFrame(() => setMounted(true));
        return () => cancelAnimationFrame(frame);
    }, []);

    return (
        <section
            id="top"
            className="relative flex min-h-svh items-center justify-center px-5 pt-24 pb-16 sm:px-8"
        >
            <div
                className={`mx-auto w-full max-w-3xl text-center transition-all duration-1000 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
                    }`}
            >
                <a
                    href={shared.links.maps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-elevate px-4 py-1.5 text-xs font-medium text-muted transition-all hover:border-accent-glow/30 hover:bg-elevate-hover hover:text-heading"
                >
                    <MapPinIcon size={14} className="text-accent-mid" />
                    {t.hero.location}
                </a>

                <h1 className="animate-pulse-glow mb-4 font-display text-4xl font-bold leading-tight tracking-tight text-heading sm:text-6xl">
                    {shared.name}
                </h1>

                <RoleCarousel roles={t.hero.roles} />

                <p className="mx-auto max-w-xl text-sm leading-relaxed text-muted sm:text-base">
                    {t.hero.tagline}
                </p>

                <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <a
                        href={shared.resumeUrl}
                        download
                        className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-accent-start to-accent-mid px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-start/25 transition-all hover:shadow-xl hover:shadow-accent-start/40 hover:brightness-110 sm:w-auto"
                    >
                        <DownloadIcon size={18} />
                        {t.hero.downloadResume}
                    </a>
                    <a
                        href="#contact"
                        className="flex w-full items-center justify-center gap-2 rounded-full border border-line bg-elevate px-6 py-3 text-sm font-semibold text-heading transition-all hover:border-accent-glow/30 hover:bg-elevate-hover sm:w-auto"
                    >
                        {t.hero.getInTouch}
                    </a>
                </div>

                <div className="mt-8 flex items-center justify-center gap-3">
                    <SocialLink href={shared.links.github} label="GitHub">
                        <GitHubIcon size={20} />
                    </SocialLink>
                    <SocialLink href={shared.links.linkedin} label="LinkedIn">
                        <LinkedInIcon size={20} />
                    </SocialLink>
                    <SocialLink href={shared.links.email} label="Email" external={false}>
                        <MailIcon size={20} />
                    </SocialLink>
                </div>
            </div>

            <a
                href="#about"
                aria-label={t.hero.scrollToAbout}
                className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 animate-bounce-slow text-muted transition-colors hover:text-heading sm:block"
            >
                <ArrowDownIcon size={22} />
            </a>
        </section>
    );
}

interface SocialLinkProps {
    href: string;
    label: string;
    external?: boolean;
    children: React.ReactNode;
}

function SocialLink({ href, label, external = true, children }: SocialLinkProps) {
    return (
        <a
            href={href}
            aria-label={label}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-elevate text-muted transition-all hover:border-accent-glow/30 hover:bg-elevate-hover hover:text-accent-end"
        >
            {children}
        </a>
    );
}
