import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi, afterEach } from 'vitest';
import { Contact } from '../components/Contact';
import { SettingsProvider } from '../context/settings';

function renderContact() {
    return render(
        <SettingsProvider>
            <Contact />
        </SettingsProvider>,
    );
}

afterEach(() => {
    vi.restoreAllMocks();
});

describe('contact form', () => {
    it('renders all form fields', () => {
        renderContact();
        expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    });

    it('shows required errors on empty submit', () => {
        renderContact();
        const submitBtn = screen.getByRole('button', { name: /send message|kirim pesan/i });
        fireEvent.click(submitBtn);

        const alerts = screen.getAllByRole('alert');
        expect(alerts.length).toBeGreaterThanOrEqual(4);
    });

    it('shows email format error for invalid email', () => {
        renderContact();
        const emailInput = screen.getByLabelText(/email/i);
        fireEvent.change(emailInput, { target: { value: 'not-an-email' } });
        fireEvent.blur(emailInput);
        const alerts = screen.getAllByRole('alert');
        const emailError = alerts.find((a) => /valid email/i.test(a.textContent ?? ''));
        expect(emailError).toBeTruthy();
    });

    it('shows success message on valid submit', () => {
        vi.spyOn(window, 'open').mockReturnValue({} as Window);
        renderContact();

        fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test User' } });
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/subject/i), { target: { value: 'Hello' } });
        fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'This is a test message with enough length.' } });

        fireEvent.click(screen.getByRole('button', { name: /send message|kirim pesan/i }));

        expect(screen.getByText(/opening your email|membuka klien email/i)).toBeInTheDocument();
    });
});
