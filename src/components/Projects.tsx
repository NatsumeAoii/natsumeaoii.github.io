import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSettings } from '../context/settings';
import type { Project, ProjectStatus } from '../i18n/types';
import { ExternalLinkIcon, GitHubIcon } from './icons';
import { Section } from './Section';

const INITIAL_COUNT = 4;
const STEP = 4;

/** Generate a deterministic gradient from the project's first tag. */
function tagGradient(tags: string[]): string {
    let hash = 0;
    const seed = tags[0] ?? 'default';
    for (let i = 0; i < seed.length; i++) {
        hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h1 = Math.abs(hash) % 360;
    const h2 = (h1 + 40) % 360;
    return `linear-gradient(135deg, hsl(${h1} 70% 35%), hsl(${h2} 60% 25%))`;
}

const STATUS_COLORS: Record<ProjectStatus, string> = {
    active: 'bg-green-500/15 text-green-400 border-green-500/30',
    archived: 'bg-gray-500/15 text-gray-400 border-gray-500/30',
    'in-progress': 'bg-amber-500/15 text-amber-400 border-amber-500/30',
};

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

function StatusBadge({ status, labels }: { status: ProjectStatus; labels: Record<ProjectStatus, string> }) {
    return (
        <span className={`absolute top-4 right-4 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${STATUS_COLORS[status]}`}>
            {labels[status]}
        </span>
    );
}

function ProjectCard({ project, statusLabels, codeLabel, demoLabel }: {
    project: Project;
    statusLabels: Record<ProjectStatus, string>;
    codeLabel: string;
    demoLabel: string;
}) {
    const [imgError, setImgError] = useState(false);
    const showImage = project.image && !imgError;
    const gradient = useMemo(() => tagGradient(project.tags), [project.tags]);

    return (
        <article
            className={`group relative flex flex-col rounded-2xl border bg-card/40 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent-glow/25 hover:shadow-xl hover:shadow-accent-start/10 ${project.featured ? 'ring-1 ring-accent-glow/20 border-line' : 'border-line'
                }`}
        >
            {project.status && (
                <StatusBadge status={project.status} labels={statusLabels} />
            )}

            {/* Image / gradient placeholder */}
            <div className="mb-4 overflow-hidden rounded-xl" style={{ aspectRatio: '16/9' }}>
                {showImage ? (
                    <img
                        src={project.image}
                        alt={project.imageAlt ?? project.title}
                        loading="lazy"
                        width={800}
                        height={450}
                        onError={() => setImgError(true)}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div
                        className="flex h-full w-full items-center justify-center text-lg font-display font-bold text-white/30"
                        style={{ background: gradient }}
                    >
                        {project.title.slice(0, 2).toUpperCase()}
                    </div>
                )}
            </div>

            <div className="mb-3 flex items-start justify-between gap-3">
                <h3 className="font-display text-lg font-semibold text-heading transition-colors group-hover:text-accent-end">
                    {project.title}
                </h3>
                <span className="shrink-0 text-xs font-medium text-muted-meta">
                    {project.year}
                </span>
            </div>

            <p className="flex-1 text-sm leading-relaxed text-muted">
                {project.description}
            </p>

            <ul className="mt-4 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                    <li
                        key={tag}
                        className="rounded-full border border-line bg-elevate px-2.5 py-1 text-xs font-medium text-accent-glow"
                    >
                        {tag}
                    </li>
                ))}
            </ul>

            {(project.repo || project.demo) && (
                <div className="mt-5 flex items-center gap-4 border-t border-line pt-4">
                    {project.repo && (
                        <a
                            href={project.repo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-heading"
                        >
                            <GitHubIcon size={16} />
                            {codeLabel}
                        </a>
                    )}
                    {project.demo && (
                        <a
                            href={project.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-sm font-medium text-accent-end transition-colors hover:text-accent-mid"
                        >
                            <ExternalLinkIcon size={16} />
                            {demoLabel}
                        </a>
                    )}
                </div>
            )}
        </article>
    );
}

export function Projects() {
    const { t } = useSettings();
    const p = t.projects;
    const gridRef = useRef<HTMLDivElement>(null);

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
    const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

    // Sync filters to URL hash — skip the initial mount so we don't
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
        const featured = p.items.filter((i) => i.featured);
        const rest = p.items.filter((i) => !i.featured);
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
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
        );
        setVisibleCount(INITIAL_COUNT);
    }, []);

    const clearFilters = useCallback(() => {
        setActiveTags([]);
        setVisibleCount(INITIAL_COUNT);
    }, []);

    const handleLoadMore = useCallback(() => {
        const prevCount = visibleCount;
        setVisibleCount((c) => Math.min(c + STEP, filteredItems.length));
        // Double-RAF: the first fires before React re-renders, the second
        // fires after the browser has painted the newly visible cards.
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                const cards = gridRef.current?.querySelectorAll('article');
                cards?.[prevCount]?.focus();
            });
        });
    }, [filteredItems.length, visibleCount]);

    return (
        <Section id="projects" eyebrow={p.eyebrow} title={p.title}>
            {/* Filter chips */}
            <div className="mb-6" role="group" aria-label={p.filterLabel}>
                <div className="flex flex-wrap gap-2">
                    {allTags.map((tag) => {
                        const isActive = activeTags.includes(tag);
                        return (
                            <button
                                key={tag}
                                type="button"
                                aria-pressed={isActive}
                                onClick={() => toggleTag(tag)}
                                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${isActive
                                    ? 'border-accent-start bg-accent-start/15 text-accent-end'
                                    : 'border-line bg-elevate text-muted hover:border-accent-glow/30 hover:text-heading'
                                    }`}
                            >
                                {tag}
                            </button>
                        );
                    })}
                </div>
                {activeTags.length > 0 && (
                    <div className="mt-3 flex items-center gap-3">
                        <span className="text-xs text-muted-meta">
                            {p.showingCount(filteredItems.length, p.items.length)}
                        </span>
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="text-xs font-medium text-accent-end transition-colors hover:text-accent-mid"
                        >
                            {p.clearFilters}
                        </button>
                    </div>
                )}
            </div>

            {/* Project grid */}
            {filteredItems.length === 0 ? (
                <div className="py-12 text-center">
                    <p className="text-muted">{p.noMatch}</p>
                    <button
                        type="button"
                        onClick={clearFilters}
                        className="mt-3 text-sm font-medium text-accent-end transition-colors hover:text-accent-mid"
                    >
                        {p.clearFilters}
                    </button>
                </div>
            ) : (
                <>
                    <div ref={gridRef} className="grid gap-5 sm:grid-cols-2" aria-live="polite">
                        {visibleProjects.map((project) => (
                            <ProjectCard
                                key={project.key}
                                project={project}
                                statusLabels={p.statusLabels}
                                codeLabel={p.codeLabel}
                                demoLabel={p.demoLabel}
                            />
                        ))}
                    </div>

                    {hasMore && (
                        <div className="mt-10 flex justify-center">
                            <button
                                type="button"
                                onClick={handleLoadMore}
                                className="flex items-center gap-2 rounded-full border border-line bg-elevate px-6 py-3 text-sm font-semibold text-heading transition-all hover:border-accent-glow/30 hover:bg-elevate-hover"
                            >
                                {p.loadMore}
                                <span className="text-muted">({remaining})</span>
                            </button>
                        </div>
                    )}
                </>
            )}
        </Section>
    );
}
