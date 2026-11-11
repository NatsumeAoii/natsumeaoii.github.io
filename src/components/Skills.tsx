import { useSettings } from '../context/settings';
import { Section } from './Section';

export function Skills() {
    const { t } = useSettings();
    const s = t.skills;

    return (
        <Section id="skills" title={s.title}>
            <div className="caps">
                {s.groups.map((group) => (
                    <div key={group.label} className="cap">
                        <h3>{group.label}</h3>
                        <p>{group.skills.join(', ')}.</p>
                    </div>
                ))}
            </div>

            <div className="certs">
                <span className="certs-label">{s.certificationsLabel}</span>
                {s.certifications.map((cert) => (
                    <span key={cert.title}>
                        <b>{cert.title}</b> · {cert.issuer} · {cert.date}
                    </span>
                ))}
            </div>

            <div className="certs certs-secondary">
                <span className="certs-label">{s.languagesLabel}</span>
                {s.languages.map((language) => (
                    <span key={language.name}>
                        <b>{language.name}</b> · {language.level}
                    </span>
                ))}
            </div>
        </Section>
    );
}
