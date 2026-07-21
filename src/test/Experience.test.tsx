import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Experience } from '../components/Experience';
import { SettingsProvider } from '../context/settings';

function renderExperience() {
    return render(
        <SettingsProvider>
            <Experience />
        </SettingsProvider>,
    );
}

describe('experience expand/collapse', () => {
    it('shows "Show more" button for items with >3 points', () => {
        renderExperience();
        const showMoreButtons = screen.getAllByText(/show more|selengkapnya/i);
        expect(showMoreButtons.length).toBeGreaterThanOrEqual(1);
    });

    it('expands to show all points when "Show more" is clicked', async () => {
        renderExperience();
        const showMoreButton = screen.getAllByText(/show more|selengkapnya/i)[0];
        fireEvent.click(showMoreButton);

        await waitFor(() => {
            expect(screen.getByText(/show less|lebih sedikit/i)).toBeInTheDocument();
        });
    });

    it('collapses back when "Show less" is clicked', async () => {
        renderExperience();
        const showMoreButton = screen.getAllByText(/show more|selengkapnya/i)[0];
        fireEvent.click(showMoreButton);

        await waitFor(() => {
            expect(screen.getByText(/show less|lebih sedikit/i)).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText(/show less|lebih sedikit/i));

        await waitFor(() => {
            expect(screen.getAllByText(/show more|selengkapnya/i).length).toBeGreaterThanOrEqual(1);
        });
    });
});
