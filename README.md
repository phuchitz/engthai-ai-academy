# EngThai AI Academy

A frontend-first English learning PWA for Thai speakers. Built with Next.js App Router, strict TypeScript, React, Tailwind CSS, Auth.js, React Hook Form, and Zod.

## Run locally

Use Node.js 24 LTS and npm. The lockfile pins the installed dependency graph.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Open [localhost:3000](http://localhost:3000). The [public demo](http://localhost:3000/demo) works without credentials. It is explicitly separate from Google-authenticated learning and does not simulate Google sign-in.

## Configure Google sign-in

1. Create a Google Cloud OAuth client of type **Web application**, configure the consent screen, and add test users while the application is in testing.
2. Register `http://localhost:3000/api/auth/callback/google` as a development redirect URI. Add the exact production callback URI separately. Use a stable preview hostname if OAuth is needed on previews; wildcard redirect URIs are not supported.
3. Set `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `AUTH_SECRET`, and `AUTH_URL` in `.env.local` or the hosting environment. Generate a random secret using the command in `.env.example`. Do not use `NEXT_PUBLIC_` variables for secrets.
4. Restart the server. Complete an actual Google login and logout, and verify direct access to `/learn/settings` redirects when signed out.

OAuth requests use Auth.js with Google OIDC and its session/CSRF/cookie protections. Sign-in requires Google's verified-email claim. Sessions use encrypted JWT cookies; the browser receives an opaque hashed account identifier for scoping local progress. The callback accepts only same-origin redirects. No credentials provider, demo bypass, OAuth token exposure, or client AI keys are included.

**Actual OAuth login is not verified until the owner configures credentials and completes the live flow.** Missing configuration fails closed with a clear setup message and a 503 response from auth endpoints.

References: [Auth.js Google setup](https://authjs.dev/getting-started/providers/google), [Auth.js installation](https://authjs.dev/getting-started/installation), [Next.js installation](https://nextjs.org/docs/app/getting-started/installation).

## Implemented iteration

- Login is the first screen at `/`; signed-in learners continue to `/learn`. The original introduction remains at `/welcome`.
- Thai is the default interface language, with persistent TH/EN controls on login and the learner workspace. See [language behavior and scope](docs/LOGIN-LANGUAGE.md).
- Welcome, login/setup errors, onboarding with multiple goals, and a private learner area.
- Adaptive 18-item preliminary grammar/vocabulary/reading check, resumable answers, skill results, limitations, and reassessment.
- Learning dashboard with explanations for lesson selection, six foundation lessons, correct-answer completion criteria, XP without duplicate awards, and Bangkok-calendar streaks.
- Five vocabulary cards with Thai meanings, browser speech playback, and local review scheduling.
- Grammar studio, activity analytics, milestones, light/dark themes, settings, progress export, and explicit reset confirmation.
- Install manifest, regular and maskable PNG icons, a public offline fallback, and a narrowly scoped service worker.
- Unit/component tests, Playwright desktop/mobile journeys, dependency audit, and GitHub Actions CI.

The AI tutor page states that AI is not connected. Typed interfaces and structured response schemas prepare a future server gateway. Listening, writing, speech transcription, and pronunciation evaluation are not implemented.

## Verification

```sh
npm run lint
npm run typecheck
npm run test:coverage
npm run build
npx playwright install chromium
npm run test:e2e
npm audit --omit=dev
npm run format:check
```

Playwright starts the production build if no local server is running. Tests cover onboarding, assessment persistence, unassessed skills, wrong-answer feedback, one-time lesson XP, mobile navigation, theme persistence, auth redirects, and public-cache/offline boundaries. Browser screenshots are saved under `docs/screenshots/` by the screen sweep.

Coverage intentionally targets assessment, learning, storage, and redirect logic. It is not whole-application coverage or proof that Google OAuth works. There is no Java backend, JaCoCo configuration, or SonarQube project in this repository.

## Data and assessment limits

See [architecture and persistence](docs/ARCHITECTURE.md) and [assessment methodology](docs/ASSESSMENT.md).

Progress lives in `localStorage`, separated by account and from the public demo. It does not sync across browsers/devices. Browser storage is not encrypted and is not an authorization boundary. Do not enter sensitive personal data. Storage failures are reported without claiming a successful save; incompatible data is not silently overwritten. Export before resetting or clearing browser data. No cloud database is provisioned.

Assessment items are author-created draft content awaiting independent educator review. Results are low-evidence learning guidance, **not validated CEFR placement, a certificate, or a probability of certification**. Productive language skills are not inferred from multiple-choice answers.

## Vercel preparation

1. Import this repository into an authorized Vercel project using the Next.js preset and Node 24. Build: `npm run build`; install: `npm ci`. No static export or output-directory override is needed.
2. Add the four auth variables to the appropriate environment. Use a distinct secret and a registered canonical `AUTH_URL` for production. Keep production credentials out of untrusted pull-request previews.
3. Deploy a preview, run the checklist in [release notes](docs/ITERATION-1.md), and complete Google login/logout on the preview hostname.
4. Promote to production only with the owner's authorization and after content review. Verify the resulting HTTPS URL and platform caching behavior.

No live deployment URL is claimed. Configuration, credentials, and an authorized Vercel/GitHub session are external prerequisites.
