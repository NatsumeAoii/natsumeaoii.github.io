import { render, screen, fireEvent } from '@testing-library/react';
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

describe('language switch', () => {
    it('switches to Indonesian when ID button is clicked', () => {
        renderControls();
        const idBtn = screen.getAllByRole('button', { name: 'ID' })[0];
        fireEvent.click(idBtn);
        expect(document.documentElement.getAttribute('lang')).toBe('id');
    });

    it('switches back to English when EN button is clicked', () => {
        renderControls();
        const idBtn = screen.getAllByRole('button', { name: 'ID' })[0];
        fireEvent.click(idBtn);
        const enBtn = screen.getAllByRole('button', { name: 'EN' })[0];
        fireEvent.click(enBtn);
        expect(document.documentElement.getAttribute('lang')).toBe('en');
    });
});
