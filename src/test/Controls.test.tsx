import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ThemeToggle, LanguageSwitcher } from '../components/Controls';
import { SettingsProvider } from '../context/settings';

function renderControls() {
    return render(
        <SettingsProvider>
            <ThemeToggle />
            <LanguageSwitcher />
        </SettingsProvider>,
    );
}

describe('theme toggle', () => {
    it('toggles data-theme attribute on click', () => {
        renderControls();
        const themeBtn = screen.getByRole('button', { name: /switch to light|switch to dark|ganti ke tema terang|ganti ke tema gelap/i });
        const initial = document.documentElement.getAttribute('data-theme');
        fireEvent.click(themeBtn);
        const after = document.documentElement.getAttribute('data-theme');
        expect(after).not.toBe(initial);
    });

    it('reverts theme on double click', () => {
        renderControls();
        const themeBtn = screen.getByRole('button', { name: /switch to light|switch to dark|ganti ke tema terang|ganti ke tema gelap/i });
        const initial = document.documentElement.getAttribute('data-theme');
        fireEvent.click(themeBtn);
        fireEvent.click(themeBtn);
        expect(document.documentElement.getAttribute('data-theme')).toBe(initial);
    });
});

describe('language toggle', () => {
    it('switches to Indonesian when the language button is clicked', () => {
        renderControls();
        const idBtn = screen.getByRole('button', { name: /switch to indonesian/i });
        fireEvent.click(idBtn);
        expect(document.documentElement.getAttribute('lang')).toBe('id');
    });

    it('shows the language it will switch to', () => {
        renderControls();

        const toIndonesian = screen.getByRole('button', { name: /switch to indonesian/i });
        expect(toIndonesian).toHaveTextContent('ID');

        fireEvent.click(toIndonesian);

        expect(
            screen.getByRole('button', { name: /ganti ke bahasa inggris/i }),
        ).toHaveTextContent('EN');
    });

    it('switches back to English when the language button is clicked', () => {
        renderControls();
        fireEvent.click(screen.getByRole('button', { name: /switch to indonesian/i }));
        fireEvent.click(screen.getByRole('button', { name: /ganti ke bahasa inggris/i }));
        expect(document.documentElement.getAttribute('lang')).toBe('en');
    });
});

describe('first visit defaults', () => {
    it('starts in light theme and Indonesian when nothing was stamped', () => {
        document.documentElement.removeAttribute('data-initial-theme');
        document.documentElement.removeAttribute('data-initial-locale');

        renderControls();

        expect(document.documentElement.getAttribute('data-theme')).toBe('light');
        expect(document.documentElement.getAttribute('lang')).toBe('id');
        expect(
            screen.getByRole('button', { name: /ganti ke bahasa inggris/i }),
        ).toHaveTextContent('EN');
    });
});

describe('document metadata', () => {
    it('follows the active locale', async () => {
        const description = document.createElement('meta');
        description.setAttribute('name', 'description');
        document.head.appendChild(description);

        renderControls();

        await waitFor(() => {
            expect(document.title).toBe('Wardana Dwi Mulia | Portfolio');
        });
        expect(description.content).toContain('Portfolio of Wardana');

        fireEvent.click(screen.getByRole('button', { name: /switch to indonesian/i }));

        await waitFor(() => {
            expect(document.title).toBe('Wardana Dwi Mulia | Portofolio');
        });
        expect(description.content).toContain('Portofolio Wardana');

        description.remove();
    });
});
