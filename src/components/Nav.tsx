import { useCallback, useEffect, useRef, useState } from 'react';
import { SECTION_IDS } from '../constants';
import { useSettings } from '../context/settings';
import { shared } from '../i18n';
import { useActiveSection } from '../hooks/useActiveSection';
import { LanguageSwitcher, ThemeToggle } from './Controls';
import { DownloadIcon } from './icons';

export function Nav() {
    const { t } = useSettings();
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const toggleRef = useRef<HTMLButtonElement>(null);

    const closeMenu = useCallback(() => setOpen(false), []);

    const activeSection = useActiveSection(SECTION_IDS);
    const navLinks = [
        { href: '/#about', label: t.nav.about, section: 'about', isRoute: false },
        { href: '/#experience', label: t.nav.experience, section: 'experience', isRoute: false },
        { href: '/#projects', label: t.nav.projects, section: 'projects', isRoute: false },
        { href: '/#skills', label: t.nav.skills, section: 'skills', isRoute: false },
        { href: '/#contact', label: t.nav.contact, section: 'contact', isRoute: false },
    ];

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 16);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Lock body scroll while the mobile menu is open.
    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    // Focus trap + Escape to close.
    useEffect(() => {
        if (!open) return;
        const container = menuRef.current;
        if (!container) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                closeMenu();
                toggleRef.current?.focus();
                return;
            }
            if (e.key !== 'Tab') return;

            const focusable = container.querySelectorAll<HTMLElement>(
                'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
            );
            if (focusable.length === 0) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        const firstLink = container.querySelector<HTMLElement>('a[href], button');
        firstLink?.focus();

        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [open, closeMenu]);

    return (
        <header
            className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled
                ? 'border-b border-line bg-void/80 backdrop-blur-xl'
                : 'border-b border-transparent'
                }`}
        >
            <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5 sm:px-8">
                <a
                    href="/#top"
                    className="font-display text-lg font-bold tracking-tight text-heading transition-colors hover:text-accent-end"
                >
                    Wardana<span className="text-accent-mid">.</span>
                </a>

                <ul className="hidden items-center gap-7 md:flex">
                    {navLinks.map((link) => {
                        const isActive = activeSection === link.section;
                        return (
                            <li key={link.href}>
                                <a
                                    href={link.href}
                                    aria-current={isActive ? 'page' : undefined}
                                    className={`text-sm font-medium transition-colors hover:text-heading ${isActive ? 'text-heading' : 'text-muted'}`}
                                >
                                    {link.label}
                                    {isActive && (
                                        <span className="block mx-auto mt-0.5 h-0.5 w-4 rounded-full bg-accent-mid" />
                                    )}
                                </a>
                            </li>
                        );
                    })}
                </ul>

                <div className="flex items-center gap-2">
                    <div className="hidden items-center gap-2 sm:flex">
                        <LanguageSwitcher />
                        <ThemeToggle />
                    </div>

                    <a
                        href={shared.resumeUrl}
                        download
                        className="hidden items-center gap-2 rounded-full border border-accent-glow/30 bg-accent-start/10 px-4 py-2 text-sm font-medium text-accent-end transition-all hover:bg-accent-start/20 hover:shadow-lg hover:shadow-accent-start/20 md:flex"
                    >
                        <DownloadIcon size={16} />
                        {t.nav.resume}
                    </a>

                    <button
                        ref={toggleRef}
                        type="button"
                        onClick={() => setOpen((v) => !v)}
                        className="flex h-11 w-11 items-center justify-center rounded-lg border border-line text-heading transition-colors hover:bg-elevate md:hidden"
                        aria-label={open ? t.a11y.closeMenu : t.a11y.openMenu}
                        aria-expanded={open}
                        aria-controls="mobile-menu"
                    >
                        <span className="relative block h-4 w-5">
                            <span
                                className={`absolute left-0 block h-0.5 w-5 bg-current transition-all duration-300 ${open ? 'top-1.5 rotate-45' : 'top-0'
                                    }`}
                            />
                            <span
                                className={`absolute left-0 top-1.5 block h-0.5 w-5 bg-current transition-all duration-300 ${open ? 'opacity-0' : 'opacity-100'
                                    }`}
                            />
                            <span
                                className={`absolute left-0 block h-0.5 w-5 bg-current transition-all duration-300 ${open ? 'top-1.5 -rotate-45' : 'top-3'
                                    }`}
                            />
                        </span>
                    </button>
                </div>
            </nav>

            {/* Mobile menu */}
            <div
                ref={menuRef}
                id="mobile-menu"
                className={`overflow-y-auto border-t border-line bg-void/95 backdrop-blur-xl transition-[max-height,opacity] duration-300 md:hidden ${open ? 'max-h-[28rem] opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <ul className="flex flex-col gap-1 px-5 py-4">
                    {navLinks.map((link) => {
                        const isActive = activeSection === link.section;
                        return (
                            <li key={link.href}>
                                <a
                                    href={link.href}
                                    onClick={closeMenu}
                                    aria-current={isActive ? 'page' : undefined}
                                    className={`block rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-elevate hover:text-heading ${isActive
                                        ? 'bg-elevate text-heading'
                                        : 'text-muted'
                                        }`}
                                >
                                    {link.label}
                                </a>
                            </li>
                        );
                    })}
                    <li>
                        <a
                            href={shared.resumeUrl}
                            download
                            onClick={closeMenu}
                            className="mt-1 flex items-center gap-2 rounded-lg border border-accent-glow/30 bg-accent-start/10 px-3 py-3 text-base font-medium text-accent-end"
                        >
                            <DownloadIcon size={18} />
                            {t.hero.downloadResume}
                        </a>
                    </li>
                    <li className="mt-3 flex items-center justify-between border-t border-line px-3 pt-4">
                        <LanguageSwitcher />
                        <ThemeToggle />
                    </li>
                </ul>
            </div>
        </header>
    );
}
