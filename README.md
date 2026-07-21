# natsumeaoii.github.io

Personal portfolio site for Wardana Dwi Mulia — a single-page React app with
hero, about, experience, projects, skills, and contact sections, plus a
downloadable resume.

## Tech Stack

- **Vite** — Build tool & dev server
- **React 19** — UI library
- **TypeScript** — Type safety (strict mode)
- **Tailwind CSS v4** — Utility-first styling (with Lightning CSS engine)

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Testing

```bash
npm test            # single run
npm run test:watch  # watch mode
```

## Linting

```bash
npm run lint
```

## Deployment

Deploys automatically to GitHub Pages on push to `main` via GitHub Actions.

## Project Structure

```
src/
├── main.tsx                       # Entry point — mounts React with SettingsProvider
├── App.tsx                        # Root layout — composes all sections + routing
├── index.css                      # Tailwind v4 config, CSS custom properties, animations
├── constants.ts                   # Shared app constants (section IDs)
├── vite-env.d.ts                  # Vite client type reference
├── context/
│   └── settings.tsx               # Theme + locale state (React context)
├── hooks/
│   ├── useReveal.ts               # IntersectionObserver-based scroll-reveal
│   ├── useActiveSection.ts        # Tracks which nav section is in view
│   └── useSectionBlur.ts          # Progressive blur on scroll-away sections
├── i18n/
│   ├── types.ts                   # Shared types (Locale, Translation) and language-neutral constants
│   ├── en.ts                      # English translation object
│   ├── id.ts                      # Indonesian translation object
│   └── index.ts                   # Barrel re-export
├── components/                    # Presentational components
│   ├── About.tsx                  # About / education section
│   ├── Background.tsx             # Animated decorative background
│   ├── BackToTop.tsx              # Floating back-to-top button
│   ├── Contact.tsx                # Contact form + direct channels
│   ├── Controls.tsx               # Theme toggle + language switcher
│   ├── ErrorBoundary.tsx          # React error boundary with fallback UI
│   ├── Experience.tsx             # Work experience timeline
│   ├── Footer.tsx                 # Site footer with social links
│   ├── Hero.tsx                   # Hero section with role carousel
│   ├── icons.tsx                  # Inline SVG icon components
│   ├── Nav.tsx                    # Fixed navigation bar (desktop + mobile)
│   ├── Projects.tsx               # Project grid with filtering + pagination
│   ├── Section.tsx                # Reusable section wrapper with reveal
│   └── Skills.tsx                 # Skills, certifications, and languages
├── pages/
│   └── NotFound.tsx               # 404 page
└── test/
    ├── setup.ts                   # Vitest setup (jsdom mocks)
    ├── App.test.tsx               # Smoke tests, routing, mobile menu
    ├── Contact.test.tsx           # Form validation tests
    ├── Controls.test.tsx          # Theme + language toggle tests
    ├── Experience.test.tsx        # Expand/collapse tests
    ├── Footer.test.tsx            # Footer rendering tests
    └── Projects.test.tsx          # Filtering + pagination tests
```

## Editing Content

All portfolio text (profile, experience, projects, skills, certifications) is
defined in the i18n layer:

- **`src/i18n/en.ts`** — English content
- **`src/i18n/id.ts`** — Indonesian content
- **`src/i18n/types.ts`** — Shared data (links, repo URLs, tags) and TypeScript interfaces

Both locale files must export a `Translation` object with identical structure.
The type system enforces this at build time.

The resume PDF is served from `public/`.
