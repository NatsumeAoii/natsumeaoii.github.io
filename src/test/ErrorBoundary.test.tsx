import { render, screen, fireEvent } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { SettingsProvider, useSettings } from '../context/settings';

function Bomb(): never {
    throw new Error('boom');
}

function Harness() {
    const { t, toggleLocale } = useSettings();
    return (
        <>
            <button type="button" onClick={toggleLocale}>
                Switch language
            </button>
            <ErrorBoundary fallback={t.errorBoundary}>
                <Bomb />
            </ErrorBoundary>
        </>
    );
}

afterEach(() => {
    vi.restoreAllMocks();
});

describe('error boundary fallback', () => {
    it('renders the fallback in the active locale and updates on switch', () => {
        vi.spyOn(console, 'error').mockImplementation(() => {});

        render(
            <SettingsProvider>
                <Harness />
            </SettingsProvider>,
        );

        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
            'Something went wrong',
        );

        fireEvent.click(screen.getByRole('button', { name: 'Switch language' }));

        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
            'Terjadi kesalahan',
        );
        expect(
            screen.getByRole('button', { name: 'Muat ulang halaman' }),
        ).toBeInTheDocument();
    });
});
