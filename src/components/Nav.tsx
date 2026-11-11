import { SECTION_IDS } from '../constants';
import { useSettings } from '../context/settings';
import { shared } from '../i18n';
import { useActiveSection } from '../hooks/useActiveSection';
import { LanguageSwitcher, ThemeToggle } from './Controls';

const INITIALS = shared.name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase();

const [firstName, ...restNameParts] = shared.name.split(' ');
const restName = restNameParts.join(' ');

export function Nav() {
    const { t } = useSettings();
    const activeSection = useActiveSection(SECTION_IDS);

    const navLinks = [
        { href: '/#about', label: t.nav.about, section: 'about' },
        { href: '/#projects', label: t.nav.projects, section: 'projects' },
        { href: '/#experience', label: t.nav.experience, section: 'experience' },
        { href: '/#skills', label: t.nav.skills, section: 'skills' },
        { href: '/#contact', label: t.nav.contact, section: 'contact' },
    ];

    return (
        <aside className="rail" aria-label={t.a11y.portfolioIndex}>
            <a className="rail-home" href="/#top">
                {t.hero.kicker}
            </a>

            <div className="rail-mark" aria-hidden="true">
                {INITIALS}
            </div>

            <div className="rail-identity">
                <p className="rail-name">
                    {firstName}
                    <br />
                    {restName}
                </p>
                <p className="rail-role">{t.hero.roles[0]}</p>
            </div>

            <nav className="rail-nav" aria-label={t.a11y.sections}>
                {navLinks.map((link, index) => {
                    const isActive = activeSection === link.section;
                    return (
                        <a
                            key={link.href}
                            href={link.href}
                            aria-current={isActive ? 'location' : undefined}
                        >
                            <span>{String(index + 1).padStart(2, '0')}</span>
                            {link.label}
                        </a>
                    );
                })}
            </nav>

            <div className="rail-foot">
                <a href={shared.links.email}>{t.contact.emailLabel}</a>
                <a href={shared.links.github} target="_blank" rel="noopener noreferrer">
                    GitHub
                </a>
                <a href={shared.links.linkedin} target="_blank" rel="noopener noreferrer">
                    LinkedIn
                </a>
                <a href={shared.resumeUrl} download>
                    {t.nav.resume}
                </a>
            </div>

            <div className="rail-tools">
                <ThemeToggle />
                <LanguageSwitcher />
            </div>
        </aside>
    );
}
