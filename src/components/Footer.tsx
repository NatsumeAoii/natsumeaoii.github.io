import { useSettings } from '../context/settings';
import { shared } from '../i18n';
import { ArrowUpIcon, GitHubIcon, LinkedInIcon, MailIcon } from './icons';

const YEAR = new Date().getFullYear();

export function Footer() {
    const { t } = useSettings();
    return (
        <footer className="border-t border-line">
            <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row sm:px-8">
                <div className="flex flex-col items-center gap-1 sm:items-start">
                    <p className="text-sm text-muted-meta">
                        &copy; {YEAR} {shared.name}
                    </p>
                    <p className="text-xs text-muted-meta">
                        Last updated: {shared.lastUpdated}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <a
                        href={shared.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub"
                        className="text-muted transition-colors hover:text-accent-end"
                    >
                        <GitHubIcon size={18} />
                    </a>
                    <a
                        href={shared.links.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn"
                        className="text-muted transition-colors hover:text-accent-end"
                    >
                        <LinkedInIcon size={18} />
                    </a>
                    <a
                        href={shared.links.email}
                        aria-label="Email"
                        className="text-muted transition-colors hover:text-accent-end"
                    >
                        <MailIcon size={18} />
                    </a>
                    <a
                        href="/#top"
                        aria-label={t.a11y.backToTop}
                        className="ml-2 flex h-9 w-9 items-center justify-center rounded-full border border-line bg-elevate text-muted transition-all hover:border-accent-glow/30 hover:bg-elevate-hover hover:text-accent-end"
                    >
                        <ArrowUpIcon size={16} />
                    </a>
                </div>
            </div>
        </footer>
    );
}
