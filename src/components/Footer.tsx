import { useSettings } from '../context/settings';
import { shared } from '../i18n';

const YEAR = new Date().getFullYear();

export function Footer() {
    const { t } = useSettings();

    return (
        <footer className="ledger-footer">
            <div>
                <p>
                    &copy; {YEAR} {shared.name}
                </p>
                <p>
                    {t.footer.lastUpdated}: {shared.lastUpdated}
                </p>
            </div>

            <div className="footer-links">
                <a href={shared.links.github} target="_blank" rel="noopener noreferrer">
                    GitHub
                </a>
                <a href={shared.links.linkedin} target="_blank" rel="noopener noreferrer">
                    LinkedIn
                </a>
                <a href={shared.links.email}>{t.contact.emailLabel}</a>
                <a href="/#top">{t.a11y.backToTop}</a>
            </div>
        </footer>
    );
}
