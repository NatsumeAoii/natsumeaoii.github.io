import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
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
        expect(screen.getByRole('heading', { name: /^profile$/i })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /^selected work$/i })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /^experience$/i })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /^capabilities$/i })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /^contact$/i })).toBeInTheDocument();
    });

    it('renders the index rail with section links', () => {
        renderApp();
        expect(screen.getByRole('link', { name: /profile/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /work/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /experience/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /capabilities/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument();
    });

    it('renders the skip-to-content link', () => {
        renderApp();
        expect(screen.getByRole('link', { name: /skip to content/i })).toBeInTheDocument();
    });

    it('renders social links in the rail and footer', () => {
        renderApp();
        expect(screen.getAllByRole('link', { name: 'GitHub' }).length).toBeGreaterThanOrEqual(2);
        expect(screen.getAllByRole('link', { name: 'LinkedIn' }).length).toBeGreaterThanOrEqual(2);
        expect(screen.getAllByRole('link', { name: 'Email' }).length).toBeGreaterThanOrEqual(2);
    });
});

describe('masthead', () => {
    it('renders the roles as static metadata', () => {
        render(
            <SettingsProvider>
                <Hero />
            </SettingsProvider>,
        );
        expect(screen.getByText(/informatics engineering graduate/i)).toBeInTheDocument();
        expect(screen.getByText(/quality assurance/i)).toBeInTheDocument();
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
