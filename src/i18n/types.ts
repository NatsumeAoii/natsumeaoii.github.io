/**
 * Type definitions and language-neutral shared data for the bilingual portfolio.
 *
 * Locale-specific content lives in `en.ts` and `id.ts`. Both import shared
 * constants from here so that links, names, tags, and repo URLs are always
 * consistent across languages.
 */

// ── Types ────────────────────────────────────────────────────────────────────

export type Locale = 'en' | 'id';

export type ProjectStatus = 'active' | 'archived' | 'in-progress';

export interface ExperienceItem {
    company: string;
    role: string;
    period: string;
    points: string[];
}

export interface Project {
    key: string;
    title: string;
    description: string;
    tags: string[];
    repo?: string;
    demo?: string;
    year: string;
    image?: string;
    imageAlt?: string;
    status?: ProjectStatus;
    featured?: boolean;
}

export interface SkillGroup {
    label: string;
    skills: string[];
}

export interface Certification {
    title: string;
    issuer: string;
    date: string;
}

export interface Translation {
    nav: {
        about: string;
        experience: string;
        projects: string;
        skills: string;
        contact: string;
        resume: string;
    };
    hero: {
        roles: string[];
        tagline: string;
        location: string;
        downloadResume: string;
        getInTouch: string;
        scrollToAbout: string;
    };
    about: {
        eyebrow: string;
        title: string;
        summary: string;
        detail: string;
        educationLabel: string;
        school: string;
        degree: string;
        gpa: string;
        period: string;
    };
    experience: {
        eyebrow: string;
        title: string;
        items: ExperienceItem[];
        showMore: string;
        showLess: string;
    };
    projects: {
        eyebrow: string;
        title: string;
        codeLabel: string;
        demoLabel: string;
        loadMore: string;
        items: Project[];
        statusLabels: { active: string; archived: string; 'in-progress': string };
        filterLabel: string;
        clearFilters: string;
        noMatch: string;
        showingCount: (shown: number, total: number) => string;
    };
    skills: {
        eyebrow: string;
        title: string;
        groups: SkillGroup[];
        certificationsLabel: string;
        certifications: Certification[];
        languagesLabel: string;
        languages: { name: string; level: string }[];
    };
    contact: {
        eyebrow: string;
        title: string;
        intro: string;
        emailLabel: string;
        formName: string;
        formEmail: string;
        formSubject: string;
        formMessage: string;
        formSubmit: string;
        formSuccess: string;
        formError: string;
        errorRequired: string;
        errorMinLength: (min: number) => string;
        errorMaxLength: (max: number) => string;
        errorEmail: string;
    };
    a11y: {
        toggleTheme: string;
        switchToLight: string;
        switchToDark: string;
        toggleLanguage: string;
        openMenu: string;
        closeMenu: string;
        backToTop: string;
    };
}

// ── Shared constants (language-neutral) ──────────────────────────────────────

/** Technology tags used across project cards. */
export const TAGS = {
    aetheris: ['TypeScript', 'Vite', 'Web App'],
    hardware: ['TypeScript', 'Web APIs', 'Diagnostics'],
    igrs: ['TypeScript', 'Data', 'Web App'],
    surl: ['TypeScript', 'Web App'],
    bensin: ['TypeScript', 'REST API', 'Open Data'],
    omniclouds: ['JavaScript', 'Full-stack', 'Cloud Storage'],
    dnd5e: ['TypeScript', 'Reference', 'Web App'],
    hoyolab: ['JavaScript', 'Google Apps Script', 'Automation'],
    telegram: ['Node.js', 'Telegram API', 'Automation'],
    saw: ['Java', 'SAW Method'],
    fivem: ['Lua', 'QBCore', 'FiveM'],
};

/** Canonical repository and demo URLs. */
export const REPOS = {
    aetheris: 'https://github.com/NatsumeAoii/Aetheris-CharGen',
    aetherisDemo: 'https://natsumeaoii.github.io/Aetheris-CharGen/',
    hardware: 'https://github.com/NatsumeAoii/Hardware-Tester',
    hardwareDemo: 'https://natsumeaoii.github.io/Hardware-Tester/',
    igrs: 'https://github.com/NatsumeAoii/Better-IGRS',
    igrsDemo: 'https://natsumeaoii.github.io/Better-IGRS/',
    surl: 'https://github.com/NatsumeAoii/surl',
    surlDemo: 'https://natsumeaoii.github.io/surl/',
    bensin: 'https://github.com/NatsumeAoii/bensin-api',
    bensinDemo: 'https://natsumeaoii.github.io/bensin-api/',
    omniclouds: 'https://github.com/NatsumeAoii/OmniClouds',
    dnd5e: 'https://github.com/NatsumeAoii/dnd5e-quickref',
    dnd5eDemo: 'https://natsumeaoii.github.io/dnd5e-quickref/',
    hoyolab: 'https://github.com/NatsumeAoii/Hoyolab-AutoSign',
    telegram: 'https://github.com/NatsumeAoii/Scammer-Revenger',
};

/** Profile data that is identical in every language. */
export const shared = {
    name: 'Wardana Dwi Mulia',
    resumeUrl: 'Wardana-Dwi-Mulia-CV.pdf',
    links: {
        github: 'https://github.com/NatsumeAoii',
        linkedin: 'https://www.linkedin.com/in/wardana-dwi-mulia-86aa52181/',
        email: 'mailto:wardana.dwi.mulia@gmail.com',
        maps: 'https://maps.app.goo.gl/nFbqSCZzmKjpHD9y7',
    },
    email: 'wardana.dwi.mulia@gmail.com',
    githubHandle: 'NatsumeAoii',
    linkedinHandle: 'wardana-dwi-mulia',
    lastUpdated: 'July 2026',
} as const;
