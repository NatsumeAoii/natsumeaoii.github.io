import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Footer } from '../components/Footer';
import { SettingsProvider } from '../context/settings';

function renderFooter() {
    return render(
        <SettingsProvider>
            <Footer />
        </SettingsProvider>,
    );
}

describe('footer', () => {
    it('renders copyright text', () => {
        renderFooter();
        expect(screen.getByText(/wardana dwi mulia/i)).toBeInTheDocument();
    });

    it('renders last updated text', () => {
        renderFooter();
        expect(screen.getByText(/last updated/i)).toBeInTheDocument();
    });

    it('renders back-to-top link', () => {
        renderFooter();
        expect(screen.getByRole('link', { name: /back to top/i })).toBeInTheDocument();
    });

    it('renders social links', () => {
        renderFooter();
        expect(screen.getByRole('link', { name: 'GitHub' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'LinkedIn' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Email' })).toBeInTheDocument();
    });
});
