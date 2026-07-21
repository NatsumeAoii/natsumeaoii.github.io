import { useState } from 'react';
import { useSettings } from '../context/settings';
import { ChevronDownIcon } from './icons';
import { Section } from './Section';

function isCurrentRole(period: string): boolean {
    return /present|sekarang/i.test(period);
}

const INITIAL_POINTS = 3;

export function Experience() {
    const { t } = useSettings();
    const e = t.experience;
    const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>({});

    const toggleExpanded = (key: string) => {
        setExpandedMap((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <Section id="experience" eyebrow={e.eyebrow} title={e.title}>
            <ol className="relative space-y-8 border-l border-line pl-6 sm:pl-8">
                {e.items.map((item) => {
                    const key = `${item.company}-${item.period}`;
                    const current = isCurrentRole(item.period);
                    const expanded = !!expandedMap[key];
                    const needsToggle = item.points.length > INITIAL_POINTS;
                    const visiblePoints = expanded || !needsToggle
                        ? item.points
                        : item.points.slice(0, INITIAL_POINTS);

                    return (
                        <li key={key} className="relative">
                            <span className="absolute -left-[31px] top-1.5 flex h-3.5 w-3.5 items-center justify-center sm:-left-[39px]" aria-hidden="true">
                                <span
                                    className={`h-3 w-3 rounded-full border-2 bg-void ${current
                                        ? 'border-green-500 animate-[pulse-dot_2s_ease-in-out_infinite]'
                                        : 'border-accent-mid'
                                        }`}
                                />
                            </span>

                            <div className={`rounded-2xl border bg-card/40 p-5 backdrop-blur-sm transition-colors hover:border-accent-glow/20 sm:p-6 ${current ? 'border-l-4 border-l-green-500/50 border-line' : 'border-line'
                                }`}>
                                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                                    <h3 className="font-display text-lg font-semibold text-heading">
                                        {item.role}
                                    </h3>
                                    <span className={`text-xs font-medium uppercase tracking-wide ${current ? 'text-green-400' : 'text-accent-mid'
                                        }`}>
                                        {item.period}
                                    </span>
                                </div>
                                <p className="mt-0.5 text-sm font-medium text-text">{item.company}</p>

                                <ul className="mt-4 space-y-2">
                                    {visiblePoints.map((point, i) => (
                                        <li
                                            key={i}
                                            className="flex gap-2.5 text-sm leading-relaxed text-muted"
                                        >
                                            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent-glow/60" />
                                            {point}
                                        </li>
                                    ))}
                                </ul>

                                {needsToggle && (
                                    <button
                                        type="button"
                                        onClick={() => toggleExpanded(key)}
                                        className="mt-3 flex items-center gap-1 text-xs font-medium text-accent-end transition-colors hover:text-accent-mid"
                                    >
                                        {expanded ? e.showLess : e.showMore}
                                        <ChevronDownIcon
                                            size={14}
                                            className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
                                        />
                                    </button>
                                )}
                            </div>
                        </li>
                    );
                })}
            </ol>
        </Section>
    );
}
