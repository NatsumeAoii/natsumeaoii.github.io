import { useState } from 'react';
import { useSettings } from '../context/settings';
import { ChevronDownIcon } from './icons';
import { Section } from './Section';

const INITIAL_POINTS = 3;

export function Experience() {
    const { t } = useSettings();
    const e = t.experience;
    const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>({});

    const toggleExpanded = (key: string) => {
        setExpandedMap((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <Section id="experience" title={e.title}>
            <div className="jobs">
                {e.items.map((item, index) => {
                    const key = `${item.company}-${item.period}`;
                    const listId = `job-points-${index}`;
                    const expanded = !!expandedMap[key];
                    const needsToggle = item.points.length > INITIAL_POINTS;
                    const visiblePoints =
                        expanded || !needsToggle
                            ? item.points
                            : item.points.slice(0, INITIAL_POINTS);

                    return (
                        <article key={key} className="job">
                            <div>
                                <h3>{item.role}</h3>
                                <p className="job-company">{item.company}</p>
                                <span className="job-period">{item.period}</span>
                            </div>

                            <div className="job-body">
                                <ul id={listId}>
                                    {visiblePoints.map((point, pointIndex) => (
                                        <li key={pointIndex}>{point}</li>
                                    ))}
                                </ul>

                                {needsToggle && (
                                    <button
                                        type="button"
                                        onClick={() => toggleExpanded(key)}
                                        aria-expanded={expanded}
                                        aria-controls={listId}
                                        className="job-toggle"
                                    >
                                        {expanded ? e.showLess : e.showMore}
                                        <ChevronDownIcon size={14} />
                                    </button>
                                )}
                            </div>
                        </article>
                    );
                })}
            </div>
        </Section>
    );
}
