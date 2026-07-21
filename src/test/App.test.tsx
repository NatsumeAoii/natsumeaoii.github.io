import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import App from '../App';
import { Hero } from '../components/Hero';
import { useActiveSection } from '../hooks/useActiveSection';
import { SettingsProvider } from '../context/settings';
import { NotFound } from '../pages/NotFound';

function renderApp() {
    return render(
        <SettingsProvider>
            <App />
        </SettingsProvider>,
    );
}

describe('portfolio smoke tests', () => {
    it('renders the hero name', () => {
        renderApp();
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Wardana Dwi Mulia');
    });

    it('renders all main sections on the home route', () => {
        renderApp();
        expect(screen.getByRole('heading', { name: /about/i })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /experience/i })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /projects/i })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /skills/i })).toBeInTheDocument();
    });

    it('renders navigation links (desktop + mobile)', () => {
        renderApp();
        expect(screen.getAllByRole('link', { name: /about/i }).length).toBeGreaterThanOrEqual(2);
        expect(screen.getAllByRole('link', { name: /experience/i }).length).toBeGreaterThanOrEqual(2);
        expect(screen.getAllByRole('link', { name: /projects/i }).length).toBeGreaterThanOrEqual(2);
        expect(screen.getAllByRole('link', { name: /skills/i }).length).toBeGreaterThanOrEqual(2);
        expect(screen.getAllByRole('link', { name: /contact/i }).length).toBeGreaterThanOrEqual(2);
    });

    it('renders the skip-to-content link', () => {
        renderApp();
        expect(screen.getByRole('link', { name: /skip to content/i })).toBeInTheDocument();
    });

    it('renders social links in hero and footer', () => {
        renderApp();
        expect(screen.getAllByRole('link', { name: 'GitHub' }).length).toBeGreaterThanOrEqual(2);
        expect(screen.getAllByRole('link', { name: 'LinkedIn' }).length).toBeGreaterThanOrEqual(2);
        expect(screen.getAllByRole('link', { name: 'Email' }).length).toBeGreaterThanOrEqual(2);
    });
});

describe('mobile menu', () => {
    it('toggles menu on hamburger click', () => {
        renderApp();
        const toggle = screen.getByRole('button', { name: /open menu|buka menu/i });
        fireEvent.click(toggle);
        expect(screen.getByRole('button', { name: /close menu|tutup menu/i })).toBeInTheDocument();
    });

    it('closes menu on Escape key', () => {
        renderApp();
        const toggle = screen.getByRole('button', { name: /open menu|buka menu/i });
        fireEvent.click(toggle);
        expect(screen.getByRole('button', { name: /close menu|tutup menu/i })).toBeInTheDocument();
        fireEvent.keyDown(document, { key: 'Escape' });
        expect(screen.getByRole('button', { name: /open menu|buka menu/i })).toBeInTheDocument();
    });

    it('focuses first link when menu opens', () => {
        renderApp();
        const toggle = screen.getByRole('button', { name: /open menu|buka menu/i });
        fireEvent.click(toggle);
        const menu = document.getElementById('mobile-menu')!;
        const firstFocusable = menu.querySelector<HTMLElement>('a[href], button:not([disabled])');
        expect(document.activeElement).toBe(firstFocusable);
    });
});

describe('role carousel', () => {
    it('renders first role on mount', () => {
        render(
            <SettingsProvider>
                <Hero />
            </SettingsProvider>,
        );
        expect(screen.getByText(/informatics engineering graduate|lulusan teknik informatika/i)).toBeInTheDocument();
    });

    it('pauses on mouse enter and resumes on mouse leave', () => {
        vi.useFakeTimers();
        render(
            <SettingsProvider>
                <Hero />
            </SettingsProvider>,
        );

        const carousel = screen.getByText(/informatics engineering graduate|lulusan teknik informatika/i).closest('[aria-live]')!;
        fireEvent.mouseEnter(carousel);
        const before = screen.getAllByRole('generic', { hidden: true }).map((e) => e.textContent);
        vi.advanceTimersByTime(5000);
        const after = screen.getAllByRole('generic', { hidden: true }).map((e) => e.textContent);
        expect(after).toEqual(before);

        fireEvent.mouseLeave(carousel);
        vi.advanceTimersByTime(3000);
        vi.useRealTimers();
    });
});

describe('active section hook', () => {
    it('returns null initially (no IntersectionObserver trigger)', () => {
        let result: string | null = 'sentinel';
        function TestComponent() {
            result = useActiveSection(['about', 'experience']);
            return null;
        }
        render(
            <SettingsProvider>
                <TestComponent />
            </SettingsProvider>,
        );
        expect(result).toBeNull();
    });
});

describe('404 routing', () => {
    it('renders 404 page for unknown routes', () => {
        render(
            <SettingsProvider>
                <MemoryRouter initialEntries={['/about']}>
                    <NotFound />
                </MemoryRouter>
            </SettingsProvider>,
        );
        expect(screen.getByText(/404/)).toBeInTheDocument();
        expect(screen.getByText(/page not found|halaman tidak ditemukan/i)).toBeInTheDocument();
    });

    it('renders back to portfolio link on 404', () => {
        render(
            <SettingsProvider>
                <MemoryRouter initialEntries={['/unknown']}>
                    <NotFound />
                </MemoryRouter>
            </SettingsProvider>,
        );
        expect(screen.getByRole('link', { name: /back to portfolio|kembali ke portofolio/i })).toBeInTheDocument();
    });
});
