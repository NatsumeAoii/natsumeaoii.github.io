import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSettings } from '../context/settings';
import type { Project, ProjectStatus } from '../i18n/types';
import { ChevronDownIcon, ExternalLinkIcon, GitHubIcon } from './icons';
import { Section } from './Section';

const INITIAL_COUNT = 4;
const STEP = 4;

/** Parse active tag filters from the URL hash: #projects?tags=A,B */
function parseFilterFromHash(): string[] {
    if (typeof window === 'undefined') return [];
    const hash = window.location.hash;
    const idx = hash.indexOf('?');
    if (idx === -1) return [];
    const params = new URLSearchParams(hash.slice(idx));
    const raw = params.get('tags');
    if (!raw) return [];
    return raw.split(',').filter(Boolean);
}

function ProjectMedia({ project, decorative = false }: { project: Project; decorative?: boolean }) {
    const [imgError, setImgError] = useState(false);

    return (
        <span className="work-media">
            {project.image && !imgError ? (
                <img
                    src={project.image}
                    alt={decorative ? '' : (project.imageAlt ?? project.title)}
                    loading="lazy"
                    width={800}
                    height={450}
                    onError={() => setImgError(true)}
                />
            ) : (
                <span className="placeholder" aria-hidden="true">
                    {project.title.slice(0, 2).toUpperCase()}
                </span>
            )}
        </span>
    );
}

interface ProjectRowProps {
    project: Project;
    index: number;
    statusLabels: Record<ProjectStatus, string>;
    codeLabel: string;
    demoLabel: string;
}

function ProjectRow({ project, index, statusLabels, codeLabel, demoLabel }: ProjectRowProps) {
    return (
        <li>
            <details className="work-entry">
                <summary className="work-row">
                    <span className="idx">{String(index).padStart(2, '0')}</span>
                    <span className="title">
                        {project.title}
                        <small>{project.tags.join(' · ')}</small>
                    </span>
                    <span className="year">{project.year}</span>
                    <span className={project.status ? `status is-${project.status}` : 'status'}>
                        {project.status ? statusLabels[project.status] : ''}
                    </span>
                    <span className="chevron" aria-hidden="true">
                        <ChevronDownIcon size={14} />
                    </span>

                    {project.image && (
                        <span className="work-preview" aria-hidden="true">
                            <span className="work-preview-head">
                                <span className="work-preview-title">{project.title}</span>
                                <span>{project.year}</span>
                            </span>
                            <ProjectMedia project={project} decorative />
                        </span>
                    )}
                </summary>

                <div className={`work-detail${project.image ? '' : ' work-detail-text'}`}>
                    <div>
                        <p className="work-desc">{project.description}</p>

                        {(project.repo || project.demo) && (
                            <div className="work-actions">
                                {project.repo && (
                                    <a
                                        className="work-link"
                                        href={project.repo}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <GitHubIcon size={14} />
                                        {codeLabel}
                                    </a>
                                )}
                                {project.demo && (
                                    <a
                                        className="work-link"
                                        href={project.demo}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <ExternalLinkIcon size={14} />
                                        {demoLabel}
                                    </a>
                                )}
                            </div>
                        )}
                    </div>

                    {project.image && <ProjectMedia project={project} />}
                </div>
            </details>
        </li>
    );
}

export function Projects() {
    const { t } = useSettings();
    const p = t.projects;
    const listRef = useRef<HTMLOListElement>(null);

    // Collect all unique tags across projects.
    const allTags = useMemo(() => {
        const set = new Set<string>();
        for (const item of p.items) {
            for (const tag of item.tags) set.add(tag);
        }
        return [...set].sort();
    }, [p.items]);

    // Active tag filters, initialized from URL.
    const [activeTags, setActiveTags] = useState<string[]>(() => parseFilterFromHash());
    const [filtersOpen, setFiltersOpen] = useState(activeTags.length > 0);
    const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

    // Sync filters to URL hash. Skip the initial mount so we don't
    // overwrite a section anchor (e.g. #about) the user navigated to.
    const isFirstFilterSync = useRef(true);
    useEffect(() => {
        if (isFirstFilterSync.current) {
            isFirstFilterSync.current = false;
            return;
        }
        if (activeTags.length > 0) {
            history.replaceState(null, '', `#projects?tags=${activeTags.join(',')}`);
        } else {
            history.replaceState(null, '', window.location.pathname + window.location.search);
        }
    }, [activeTags]);

    // Reset pagination when the project count changes.
    useEffect(() => {
        setVisibleCount(INITIAL_COUNT);
    }, [p.items.length]);

    // Featured sort: featured first, then rest (stable within groups).
    const sortedItems = useMemo(() => {
        const featured = p.items.filter((item) => item.featured);
        const rest = p.items.filter((item) => !item.featured);
        return [...featured, ...rest];
    }, [p.items]);

    // Filter by active tags (AND logic).
    const filteredItems = useMemo(() => {
        if (activeTags.length === 0) return sortedItems;
        return sortedItems.filter((item) =>
            activeTags.every((tag) => item.tags.includes(tag)),
        );
    }, [sortedItems, activeTags]);

    const visibleProjects = filteredItems.slice(0, visibleCount);
    const remaining = filteredItems.length - visibleCount;
    const hasMore = remaining > 0;

    const toggleTag = useCallback((tag: string) => {
        setActiveTags((prev) =>
            prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag],
        );
        setVisibleCount(INITIAL_COUNT);
    }, []);

    const clearFilters = useCallback(() => {
        setActiveTags([]);
        setVisibleCount(INITIAL_COUNT);
    }, []);

    const handleLoadMore = useCallback(() => {
        const prevCount = visibleCount;
        setVisibleCount((count) => Math.min(count + STEP, filteredItems.length));
        // Double RAF: the first fires before React re-renders, the second
        // after the browser has painted the newly visible rows.
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                const rows = listRef.current?.querySelectorAll<HTMLElement>('summary.work-row');
                rows?.[prevCount]?.focus();
            });
        });
    }, [filteredItems.length, visibleCount]);

    return (
        <Section id="projects" title={p.title}>
            <div className="filter-disclosure">
                <button
                    type="button"
                    className="filter-summary"
                    aria-expanded={filtersOpen}
                    aria-controls="project-filters"
                    onClick={() => setFiltersOpen((open) => !open)}
                >
                    {p.filterLabel}
                    {activeTags.length > 0 && (
                        <span className="filter-count">({activeTags.length})</span>
                    )}
                    <ChevronDownIcon size={14} />
                </button>

                {filtersOpen && (
                    <div
                        id="project-filters"
                        className="filter-panel"
                        role="group"
                        aria-label={p.filterLabel}
                    >
                        {allTags.map((tag) => {
                            const isActive = activeTags.includes(tag);
                            return (
                                <button
                                    key={tag}
                                    type="button"
                                    aria-pressed={isActive}
                                    onClick={() => toggleTag(tag)}
                                    className="filter-chip"
                                >
                                    {tag}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="filter-status">
                <span>{p.showingCount(filteredItems.length, p.items.length)}</span>
                {activeTags.length > 0 && (
                    <button type="button" onClick={clearFilters} className="filter-clear">
                        {p.clearFilters}
                    </button>
                )}
            </div>

            {filteredItems.length === 0 ? (
                <div className="work-empty">
                    <p>{p.noMatch}</p>
                    <button type="button" onClick={clearFilters} className="filter-clear">
                        {p.clearFilters}
                    </button>
                </div>
            ) : (
                <>
                    <ol className="work-list" ref={listRef} aria-live="polite">
                        {visibleProjects.map((project, index) => (
                            <ProjectRow
                                key={project.key}
                                project={project}
                                index={index + 1}
                                statusLabels={p.statusLabels}
                                codeLabel={p.codeLabel}
                                demoLabel={p.demoLabel}
                            />
                        ))}
                    </ol>

                    {hasMore && (
                        <div className="work-more">
                            <button type="button" onClick={handleLoadMore}>
                                {p.loadMore} ({remaining})
                            </button>
                        </div>
                    )}
                </>
            )}
        </Section>
    );
}
