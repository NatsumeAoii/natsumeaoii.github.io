import { useSettings } from '../context/settings';
import { Section } from './Section';

export function Skills() {
    const { t } = useSettings();
    const s = t.skills;

    return (
        <Section id="skills" eyebrow={s.eyebrow} title={s.title}>
            <div className="grid gap-5 sm:grid-cols-2">
                {s.groups.map((group) => (
                    <div
                        key={group.label}
                        className="rounded-2xl border border-line bg-card/40 p-6 backdrop-blur-sm"
                    >
                        <h3 className="mb-4 font-display text-base font-semibold text-heading">
                            {group.label}
                        </h3>
                        <ul className="flex flex-wrap gap-2">
                            {group.skills.map((skill) => (
                                <li
                                    key={skill}
                                    className="rounded-lg border border-line bg-elevate px-3 py-1.5 text-sm text-text transition-colors hover:border-accent-glow/30 hover:text-heading"
                                >
                                    {skill}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div className="rounded-2xl border border-line bg-card/40 p-6 backdrop-blur-sm">
                    <h3 className="mb-4 font-display text-base font-semibold text-heading">
                        {s.certificationsLabel}
                    </h3>
                    <ul className="space-y-3">
                        {s.certifications.map((cert) => (
                            <li key={cert.title} className="flex items-baseline justify-between gap-3">
                                <span className="text-sm text-text">
                                    {cert.title}
                                    <span className="text-muted"> · {cert.issuer}</span>
                                </span>
                                <span className="shrink-0 text-xs text-muted-meta">{cert.date}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="rounded-2xl border border-line bg-card/40 p-6 backdrop-blur-sm">
                    <h3 className="mb-4 font-display text-base font-semibold text-heading">
                        {s.languagesLabel}
                    </h3>
                    <ul className="space-y-3">
                        {s.languages.map((lang) => (
                            <li key={lang.name} className="flex items-baseline justify-between gap-3">
                                <span className="text-sm text-text">{lang.name}</span>
                                <span className="shrink-0 text-xs text-accent-mid">{lang.level}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </Section>
    );
}
