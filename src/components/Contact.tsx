import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { useSettings } from '../context/settings';
import { shared } from '../i18n';
import { GitHubIcon, LinkedInIcon, MailIcon } from './icons';
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

            // Use a temporary link element to trigger mailto — more reliable than
            // window.open which returns null on success for protocol handlers in
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
            icon: <MailIcon size={22} />,
            external: false,
        },
        {
            label: 'LinkedIn',
            value: shared.linkedinHandle,
            href: shared.links.linkedin,
            icon: <LinkedInIcon size={22} />,
            external: true,
        },
        {
            label: 'GitHub',
            value: shared.githubHandle,
            href: shared.links.github,
            icon: <GitHubIcon size={22} />,
            external: true,
        },
    ];

    const inputClass = (field: keyof FieldErrors) =>
        `w-full rounded-xl border bg-elevate px-4 py-3 text-sm text-text placeholder:text-muted/50 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-start/40 ${errors[field] ? 'border-red-500/50' : 'border-line hover:border-accent-glow/30'
        }`;

    return (
        <Section id="contact" eyebrow={c.eyebrow} title={c.title}>
            <p className="mb-8 max-w-xl text-base leading-relaxed text-muted">{c.intro}</p>

            <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
                {/* Contact form */}
                {submitted ? (
                    <div className="flex items-center justify-center rounded-2xl border border-line bg-card/40 p-8 backdrop-blur-sm">
                        <div className="text-center">
                            <p className="text-sm font-medium text-heading">
                                {c.formSuccess}
                            </p>
                            <a
                                href={shared.links.email}
                                className="mt-3 inline-block text-sm font-medium text-accent-end hover:text-accent-mid"
                            >
                                {shared.email}
                            </a>
                        </div>
                    </div>
                ) : (
                    <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-4">
                        {/* Honeypot — hidden from real users */}
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

                        <div>
                            <label htmlFor="contact-name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
                                {c.formName}
                            </label>
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
                                className={inputClass('name')}
                            />
                            {errors.name && (
                                <p id="err-name" className="mt-1 text-xs text-red-400" role="alert">{errors.name}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="contact-email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
                                {c.formEmail}
                            </label>
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
                                className={inputClass('email')}
                            />
                            {errors.email && (
                                <p id="err-email" className="mt-1 text-xs text-red-400" role="alert">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="contact-subject" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
                                {c.formSubject}
                            </label>
                            <input
                                ref={subjectRef}
                                id="contact-subject"
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                onBlur={handleBlur}
                                aria-describedby={errors.subject ? 'err-subject' : undefined}
                                aria-invalid={!!errors.subject}
                                className={inputClass('subject')}
                            />
                            {errors.subject && (
                                <p id="err-subject" className="mt-1 text-xs text-red-400" role="alert">{errors.subject}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="contact-message" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
                                {c.formMessage}
                            </label>
                            <textarea
                                ref={messageRef}
                                id="contact-message"
                                rows={5}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onBlur={handleBlur}
                                aria-describedby={errors.message ? 'err-message' : undefined}
                                aria-invalid={!!errors.message}
                                className={`${inputClass('message')} resize-y`}
                            />
                            {errors.message && (
                                <p id="err-message" className="mt-1 text-xs text-red-400" role="alert">{errors.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded-full bg-gradient-to-r from-accent-start to-accent-mid px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-start/25 transition-all hover:shadow-xl hover:shadow-accent-start/40 hover:brightness-110"
                        >
                            {c.formSubmit}
                        </button>
                    </form>
                )}

                {/* Direct channels */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                    {channels.map((channel) => (
                        <a
                            key={channel.label}
                            href={channel.href}
                            {...(channel.external
                                ? { target: '_blank', rel: 'noopener noreferrer' }
                                : {})}
                            className="group flex items-center gap-4 rounded-2xl border border-line bg-card/40 p-5 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-accent-glow/25 hover:shadow-lg hover:shadow-accent-start/10"
                        >
                            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-line bg-elevate text-accent-end transition-colors group-hover:bg-accent-start/10">
                                {channel.icon}
                            </span>
                            <span className="min-w-0">
                                <span className="block text-xs font-semibold uppercase tracking-wide text-muted">
                                    {channel.label}
                                </span>
                                <span className="block truncate text-sm font-medium text-text">
                                    {channel.value}
                                </span>
                            </span>
                        </a>
                    ))}
                </div>
            </div>
        </Section>
    );
}
