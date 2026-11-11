import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, beforeEach } from 'vitest';
import { Projects } from '../components/Projects';
import { SettingsProvider } from '../context/settings';
import { LanguageSwitcher } from '../components/Controls';

function renderProjects() {
    return render(
        <SettingsProvider>
            <Projects />
        </SettingsProvider>,
    );
}

function openFilters() {
    fireEvent.click(screen.getByRole('button', { name: /filter by tag|filter berdasarkan tag/i }));
}

beforeEach(() => {
    history.replaceState(null, '', window.location.pathname);
});

describe('project filtering', () => {
    it('renders filter chips for each unique tag after opening the disclosure', () => {
        renderProjects();
        openFilters();
        expect(screen.getByRole('button', { name: 'TypeScript' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Lua' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Java' })).toBeInTheDocument();
    });

    it('filters projects when a tag chip is clicked', async () => {
        renderProjects();
        openFilters();
        fireEvent.click(screen.getByRole('button', { name: 'Lua' }));

        await waitFor(() => {
            expect(screen.getByText('FiveM Roleplay Server')).toBeInTheDocument();
        });
        expect(screen.queryByText('Aetheris CharGen')).not.toBeInTheDocument();
    });

    it('shows clear filters button and count when filter active', async () => {
        renderProjects();
        openFilters();
        fireEvent.click(screen.getByRole('button', { name: 'Lua' }));

        await waitFor(() => {
            expect(screen.getByText(/clear filters|hapus filter/i)).toBeInTheDocument();
        });
        expect(screen.getByText(/showing|menampilkan/i)).toBeInTheDocument();
    });

    it('clears all filters when clear button is clicked', async () => {
        renderProjects();
        openFilters();
        fireEvent.click(screen.getByRole('button', { name: 'TypeScript' }));

        await waitFor(() => {
            expect(screen.getByText(/clear filters|hapus filter/i)).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText(/clear filters|hapus filter/i));

        await waitFor(() => {
            expect(screen.queryByText(/clear filters|hapus filter/i)).not.toBeInTheDocument();
        });
    });
});

describe('hover preview', () => {
    it('attaches a decorative preview with the real screenshot to rows that have one', () => {
        const { container } = renderProjects();
        const firstEntry = container.querySelector('.work-entry');
        const preview = firstEntry?.querySelector('.work-preview');

        expect(preview).toHaveAttribute('aria-hidden', 'true');
        expect(preview).toHaveTextContent('Aetheris CharGen');
        expect(preview?.querySelector('img')).toHaveAttribute('src', '/projects/aetheris.png');
        expect(preview?.querySelector('img')).toHaveAttribute('alt', '');
    });

    it('leaves projects without a screenshot unpreviewed', async () => {
        const { container } = renderProjects();
        fireEvent.click(screen.getByRole('button', { name: /load more|muat lebih/i }));
        fireEvent.click(screen.getByRole('button', { name: /load more|muat lebih/i }));

        await waitFor(() => {
            expect(container.querySelectorAll('.work-entry')).toHaveLength(11);
        });

        const sawEntry = [...container.querySelectorAll('.work-entry')].find((entry) =>
            entry.textContent?.includes('Decision Support System'),
        );
        expect(sawEntry).toBeDefined();
        expect(sawEntry?.querySelector('.work-preview')).toBeNull();
    });
});

describe('pagination', () => {
    it('shows load more button when there are more projects', () => {
        renderProjects();
        expect(screen.getByRole('button', { name: /load more|muat lebih/i })).toBeInTheDocument();
    });

    it('shows more rows after clicking load more', async () => {
        renderProjects();
        const loadMoreBtn = screen.getByRole('button', { name: /load more|muat lebih/i });
        fireEvent.click(loadMoreBtn);

        await waitFor(() => {
            const rows = document.querySelectorAll('.work-entry');
            expect(rows.length).toBeGreaterThan(4);
        });
    });

    it('hides load more button when all projects are visible', async () => {
        renderProjects();
        const loadMoreBtn = screen.getByRole('button', { name: /load more|muat lebih/i });
        // Click load more until button disappears (11 projects total, step 4).
        fireEvent.click(loadMoreBtn); // 8
        fireEvent.click(loadMoreBtn); // 11 (all)

        await waitFor(() => {
            expect(screen.queryByRole('button', { name: /load more|muat lebih/i })).not.toBeInTheDocument();
        });
    });

    it('pagination survives language switch', async () => {
        render(
            <SettingsProvider>
                <LanguageSwitcher />
                <Projects />
            </SettingsProvider>,
        );

        const loadMoreBtn = screen.getByRole('button', { name: /load more|muat lebih/i });
        fireEvent.click(loadMoreBtn);

        await waitFor(() => {
            const rows = document.querySelectorAll('.work-entry');
            expect(rows.length).toBe(8);
        });

        const idBtn = screen.getAllByRole('button', { name: 'ID' })[0];
        fireEvent.click(idBtn);

        await waitFor(() => {
            const rows = document.querySelectorAll('.work-entry');
            expect(rows.length).toBe(8);
        });
    });
});
