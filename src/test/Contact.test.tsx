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

function fillValidDraft() {
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/subject/i), { target: { value: 'Hello' } });
    fireEvent.change(screen.getByLabelText(/message/i), {
        target: { value: 'This is a test message with enough length.' },
    });
}

function submit() {
    fireEvent.click(screen.getByRole('button', { name: /send message|kirim pesan/i }));
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

    it('marks required fields for assistive technology', () => {
        renderContact();
        for (const label of [/name/i, /email/i, /subject/i, /message/i]) {
            const field = screen.getByLabelText(label);
            expect(field).toBeRequired();
            expect(field).toHaveAttribute('aria-required', 'true');
        }
    });

    it('shows required errors on empty submit', () => {
        renderContact();
        submit();

        const alerts = screen.getAllByRole('alert');
        expect(alerts.length).toBeGreaterThanOrEqual(4);
    });

    it('validates only the field being blurred', () => {
        renderContact();
        fireEvent.blur(screen.getByLabelText(/name/i));

        const alerts = screen.getAllByRole('alert');
        expect(alerts).toHaveLength(1);
        expect(screen.getByText(/this field is required/i)).toBeInTheDocument();
        expect(screen.queryByText(/valid email/i)).not.toBeInTheDocument();
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

    it('sends the draft through a mailto link on valid submit', () => {
        const opened: string[] = [];
        vi.spyOn(HTMLElement.prototype, 'click').mockImplementation(function (this: HTMLElement) {
            opened.push(this.getAttribute('href') ?? '');
        });

        renderContact();
        fillValidDraft();
        submit();

        expect(opened).toHaveLength(1);
        expect(opened[0]).toContain('mailto:wardana.dwi.mulia@gmail.com');
        expect(opened[0]).toContain(encodeURIComponent('Hello'));
        expect(opened[0]).toContain(
            encodeURIComponent('This is a test message with enough length.'),
        );
        expect(screen.getByText(/opening your email|membuka klien email/i)).toBeInTheDocument();
    });

    it('shows the manual fallback and keeps the draft when mailto fails', () => {
        vi.spyOn(HTMLElement.prototype, 'click').mockImplementation(() => {
            throw new Error('blocked');
        });

        renderContact();
        fillValidDraft();
        submit();

        expect(screen.getByRole('alert')).toHaveTextContent(
            /could not open email client|aplikasi email tidak bisa dibuka/i,
        );
        expect(screen.getByLabelText(/name/i)).toHaveValue('Test User');
        expect(screen.getByLabelText(/message/i)).toHaveValue(
            'This is a test message with enough length.',
        );
        expect(
            screen.queryByText(/opening your email|membuka klien email/i),
        ).not.toBeInTheDocument();
    });
});
