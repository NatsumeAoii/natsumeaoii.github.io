import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { useSettings } from '../context/settings';
import { shared } from '../i18n';
import { Section } from './Section';

interface FieldErrors {
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
}

const NAME_MIN = 2;
const NAME_MAX = 100;
const EMAIL_MAX = 254;
const SUBJECT_MIN = 3;
const SUBJECT_MAX = 150;
const MESSAGE_MIN = 10;
const MESSAGE_MAX = 5000;

function validate(
    name: string,
    email: string,
    subject: string,
    message: string,
    c: ReturnType<typeof useSettings>['t']['contact'],
): FieldErrors {
    const errors: FieldErrors = {};

    if (!name.trim()) errors.name = c.errorRequired;
    else if (name.trim().length < NAME_MIN) errors.name = c.errorMinLength(NAME_MIN);
    else if (name.trim().length > NAME_MAX) errors.name = c.errorMaxLength(NAME_MAX);

    if (!email.trim()) errors.email = c.errorRequired;
    else if (email.trim().length > EMAIL_MAX) errors.email = c.errorMaxLength(EMAIL_MAX);
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errors.email = c.errorEmail;

    if (!subject.trim()) errors.subject = c.errorRequired;
    else if (subject.trim().length < SUBJECT_MIN) errors.subject = c.errorMinLength(SUBJECT_MIN);
    else if (subject.trim().length > SUBJECT_MAX) errors.subject = c.errorMaxLength(SUBJECT_MAX);

    if (!message.trim()) errors.message = c.errorRequired;
    else if (message.trim().length < MESSAGE_MIN) errors.message = c.errorMinLength(MESSAGE_MIN);
    else if (message.trim().length > MESSAGE_MAX) errors.message = c.errorMaxLength(MESSAGE_MAX);

    return errors;
}

export function Contact() {
    const { t } = useSettings();
    const c = t.contact;

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [honeypot, setHoneypot] = useState('');
    const [errors, setErrors] = useState<FieldErrors>({});
    const [submitted, setSubmitted] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const resetTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const subjectRef = useRef<HTMLInputElement>(null);
    const messageRef = useRef<HTMLTextAreaElement>(null);

    const fieldRefs = useMemo(
        () => ({
            name: nameRef,
            email: emailRef,
            subject: subjectRef,
            message: messageRef,
        }),
        [],
    );

    // Clear reset timer on unmount.
    useEffect(() => () => clearTimeout(resetTimerRef.current), []);

    const handleBlur = useCallback(() => {
        setErrors(validate(name, email, subject, message, c));
    }, [name, email, subject, message, c]);

    const handleSubmit = useCallback(
        (e: FormEvent) => {
            e.preventDefault();

            // Honeypot: silently discard.
            if (honeypot) return;

            const fieldErrors = validate(name, email, subject, message, c);
            setErrors(fieldErrors);

            if (Object.keys(fieldErrors).length > 0) {
                // Focus first invalid field.
                const firstKey = Object.keys(fieldErrors)[0] as keyof FieldErrors;
                fieldRefs[firstKey]?.current?.focus();
                return;
            }

            const mailto = `mailto:${shared.email}?subject=${encodeURIComponent(subject.trim())}&body=${encodeURIComponent(
                `Name: ${name.trim()}\nEmail: ${email.trim()}\n\n${message.trim()}`,
            )}`;

            // Use a temporary link element to trigger mailto. More reliable than
            // window.open, which returns null on success for protocol handlers in
            // most browsers.
            try {
                const a = document.createElement('a');
                a.href = mailto;
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            } catch {
                // Navigation may fail in restricted environments; the fallback
                // link is always visible so the user can send manually.
            }

            // Clear any pending reset timer from a previous rapid re-submit.
            clearTimeout(resetTimerRef.current);

            setSubmitted(true);
            resetTimerRef.current = setTimeout(() => {
                setSubmitted(false);
                setName('');
                setEmail('');
                setSubject('');
                setMessage('');
                setErrors({});
            }, 5000);
        },
        [name, email, subject, message, honeypot, c, fieldRefs],
    );

    const channels = [
        {
            label: c.emailLabel,
            value: shared.email,
            href: shared.links.email,
            external: false,
        },
        {
            label: 'LinkedIn',
            value: shared.linkedinHandle,
            href: shared.links.linkedin,
            external: true,
        },
        {
            label: 'GitHub',
            value: shared.githubHandle,
            href: shared.links.github,
            external: true,
        },
    ];

    return (
        <Section id="contact" title={c.title}>
            <p className="contact-line">{c.intro}</p>
            <a className="email" href={shared.links.email}>
                {shared.email}
            </a>

            <div className="contact-grid">
                <div className="channels">
                    {channels.map((channel) => (
                        <a
                            key={channel.label}
                            className="channel"
                            href={channel.href}
                            {...(channel.external
                                ? { target: '_blank', rel: 'noopener noreferrer' }
                                : {})}
                        >
                            <span className="channel-label">{channel.label}</span>
                            <span className="channel-value">{channel.value}</span>
                        </a>
                    ))}
                </div>

                {submitted ? (
                    <div className="form-success" role="status">
                        <div>
                            <p>{c.formSuccess}</p>
                            <a href={shared.links.email}>{shared.email}</a>
                        </div>
                    </div>
                ) : (
                    <form ref={formRef} onSubmit={handleSubmit} noValidate className="contact-form">
                        {/* Honeypot, hidden from real users */}
                        <div className="hidden" aria-hidden="true">
                            <label>
                                Website
                                <input
                                    type="text"
                                    name="website"
                                    tabIndex={-1}
                                    autoComplete="off"
                                    value={honeypot}
                                    onChange={(e) => setHoneypot(e.target.value)}
                                />
                            </label>
                        </div>

                        <div className="field">
                            <label htmlFor="contact-name">{c.formName}</label>
                            <input
                                ref={nameRef}
                                id="contact-name"
                                type="text"
                                autoComplete="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                onBlur={handleBlur}
                                aria-describedby={errors.name ? 'err-name' : undefined}
                                aria-invalid={!!errors.name}
                            />
                            {errors.name && (
                                <p id="err-name" className="field-error" role="alert">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div className="field">
                            <label htmlFor="contact-email">{c.formEmail}</label>
                            <input
                                ref={emailRef}
                                id="contact-email"
                                type="email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onBlur={handleBlur}
                                aria-describedby={errors.email ? 'err-email' : undefined}
                                aria-invalid={!!errors.email}
                            />
                            {errors.email && (
                                <p id="err-email" className="field-error" role="alert">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div className="field">
                            <label htmlFor="contact-subject">{c.formSubject}</label>
                            <input
                                ref={subjectRef}
                                id="contact-subject"
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                onBlur={handleBlur}
                                aria-describedby={errors.subject ? 'err-subject' : undefined}
                                aria-invalid={!!errors.subject}
                            />
                            {errors.subject && (
                                <p id="err-subject" className="field-error" role="alert">
                                    {errors.subject}
                                </p>
                            )}
                        </div>

                        <div className="field">
                            <label htmlFor="contact-message">{c.formMessage}</label>
                            <textarea
                                ref={messageRef}
                                id="contact-message"
                                rows={4}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onBlur={handleBlur}
                                aria-describedby={errors.message ? 'err-message' : undefined}
                                aria-invalid={!!errors.message}
                            />
                            {errors.message && (
                                <p id="err-message" className="field-error" role="alert">
                                    {errors.message}
                                </p>
                            )}
                        </div>

                        <button type="submit" className="btn-primary">
                            {c.formSubmit}
                        </button>
                    </form>
                )}
            </div>
        </Section>
    );
}
