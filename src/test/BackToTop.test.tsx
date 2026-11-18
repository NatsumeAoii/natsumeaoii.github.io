import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi, afterEach } from 'vitest';
import { BackToTop } from '../components/BackToTop';
import { SettingsProvider } from '../context/settings';

const originalMatchMedia = window.matchMedia;
const originalScrollTo = window.scrollTo;

function setReducedMotion(reduced: boolean) {
    window.matchMedia = ((query: string) => ({
        matches: reduced && query.includes('prefers-reduced-motion'),
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
    })) as typeof window.matchMedia;
}

function makeVisible() {
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 500 });
    fireEvent.scroll(window);
}

afterEach(() => {
    window.matchMedia = originalMatchMedia;
    window.scrollTo = originalScrollTo;
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 });
    vi.restoreAllMocks();
});

describe('back to top', () => {
    it('uses instant scrolling when reduced motion is requested', async () => {
        const scrollTo = vi.fn();
        window.scrollTo = scrollTo as typeof window.scrollTo;
        setReducedMotion(true);

        render(
            <SettingsProvider>
                <BackToTop />
            </SettingsProvider>,
        );
        makeVisible();

        fireEvent.click(
            await screen.findByRole('button', { name: /back to top|kembali ke atas/i }),
        );

        expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'auto' });
    });

    it('uses smooth scrolling by default', async () => {
        const scrollTo = vi.fn();
        window.scrollTo = scrollTo as typeof window.scrollTo;
        setReducedMotion(false);

        render(
            <SettingsProvider>
                <BackToTop />
            </SettingsProvider>,
        );
        makeVisible();

        fireEvent.click(
            await screen.findByRole('button', { name: /back to top|kembali ke atas/i }),
        );

        expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    });
});
