import { useState } from 'react';
import { useSettings } from '../context/settings';
import { shared } from '../i18n';
import { Section } from './Section';

const INITIALS = shared.name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

export function About() {
    const { t } = useSettings();
    const a = t.about;
    const [imgError, setImgError] = useState(false);

    return (
        <Section id="about" eyebrow={a.eyebrow} title={a.title}>
            <div className="grid gap-8 md:grid-cols-[1.6fr_1fr]">
                <div className="space-y-4">
                    <p className="text-base leading-relaxed text-text">{a.summary}</p>
                    <p className="text-base leading-relaxed text-muted">{a.detail}</p>
                </div>

                <div className="flex flex-col items-center gap-5">
                    {/* Profile photo with initials fallback */}
                    <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border-2 border-accent-glow/20">
                        {!imgError ? (
                            <img
                                src="/profile-photo.jpg"
                                alt={shared.name}
                                loading="lazy"
                                width={112}
                                height={112}
                                onError={() => setImgError(true)}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent-start to-accent-end text-2xl font-display font-bold text-white">
                                {INITIALS}
                            </div>
                        )}
                    </div>

                    <div className="w-full rounded-2xl border border-line bg-card/40 p-6 backdrop-blur-sm">
                        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-accent-mid">
                            {a.educationLabel}
                        </p>
                        <h3 className="font-display text-lg font-semibold text-heading">{a.school}</h3>
                        <p className="mt-1 text-sm text-text">{a.degree}</p>
                        <p className="mt-2 text-sm text-muted">{a.gpa}</p>
                        <p className="mt-1 text-sm text-muted">{a.period}</p>
                    </div>
                </div>
            </div>
        </Section>
    );
}
