import { useSettings } from '../context/settings';
import { shared } from '../i18n';
import { MapPinIcon } from './icons';

const [firstName, ...restNameParts] = shared.name.split(' ');
const restName = restNameParts.join(' ');

export function Hero() {
    const { t } = useSettings();

    return (
        <header id="top" className="masthead">
            <p className="kicker">{t.hero.kicker}</p>

            <h1 className="ledger-title">
                {firstName}{' '}
                <br />
                <em>{restName}</em>
            </h1>

            <p className="tagline">{t.hero.tagline}</p>
            <p className="role-line">{t.hero.roles.join(' · ')}</p>

            <div className="meta-row">
                <a
                    href={shared.links.maps}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <MapPinIcon size={12} />
                    {t.hero.location}
                </a>
                <span>
                    <b>{t.hero.status}</b>
                </span>
            </div>
        </header>
    );
}
