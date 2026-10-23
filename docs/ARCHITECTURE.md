# Architecture and decisions

## Actual starting state

The checkout contained one initial commit (`0de08d0`) and a 20-byte README. Git status and diff were clean. There was no application, dependency manifest, test suite, authentication, PWA, CI, backend, JaCoCo, or SonarQube configuration. The supplied attachment was the implementation prompt; no sprint ZIP was attached to this task.

## Routing and authentication

- `/` and `/login`: public entry points, setup status, and real Google OAuth initiation through server actions.
- `/demo/[[...segments]]`: public product exploration, clearly labeled, with a separate browser storage namespace.
- `/learn/[[...segments]]`: server-rendered protected entry. Every screen resolves `auth()` before returning learner UI. Unknown screens return 404. Missing auth configuration redirects to setup; no test bypass is included.
- `/api/auth/[...nextauth]`: Auth.js handlers, unavailable without configuration. There is no learning-data API yet.

Auth.js owns OIDC verification, CSRF handling, encrypted session cookies, and logout. The sign-in callback checks the verified-email claim. Redirects are restricted to the canonical origin. Server-only imports keep secrets and cryptographic account hashing off the client. Deploy behind HTTPS and a trusted host; do not enable arbitrary host trust.

## State and persistence

The application shell owns learner state; screen components receive explicit state and mutation callbacks. Zustand is unnecessary at this size. React Hook Form/Zod centralize onboarding validation. The reusable Button follows shadcn conventions with `cva`, `clsx`, and `tailwind-merge`; no unneeded Radix interactions are introduced.

`ProgressRepository` separates persistence from UI. `browserRepository` validates a versioned schema on both load and save. A future authenticated server repository should migrate data only with user consent and server-side validation. A hashed account ID scopes local progress. This prevents accidental account mixing, not access by someone who controls the browser or same-origin JavaScript.

Progress storage contains preferences, assessment answers, lesson completion records, and vocabulary reviews. Cross-tab storage events reload changes, but simultaneous writes are last-writer-wins. Storage has no cross-device synchronization or backup. Clearing browser data or private browsing can discard it. No PII, OAuth tokens, or secrets are deliberately persisted in learning storage. Display names and free-form motivation are user input and may still contain personal data; the UI warns against sensitive content.

Storage failure blocks the mutation and reports an error. Invalid saved data is left intact until an explicit reset. Export is a browser-generated JSON download of currently loaded state; there is no import/migration tool or automatic recovery of corrupted records.

## Learning and assessment

Pure functions select questions, score recognition evidence, rank foundation practice, award first-completion XP, schedule reviews, and aggregate Bangkok-calendar days. Lesson ranking considers observed skill gaps first, a travel goal second, and completion history. Other learning goals are collected for later content expansion; the initial six lessons do not provide a full curriculum or difficulty progression for advanced learners.

Each lesson includes an objective, estimated time, explanation, Thai support, examples, one exercise, feedback, and completion criteria. Retrying is allowed; first-try accuracy is not retained, and completion is not a claim of mastery. XP is awarded once per lesson. Review of completed lessons does not earn additional XP or extend streaks; vocabulary review currently has no XP. The daily goal uses estimated completed-lesson minutes, not timed active study.

Review scheduling doubles remembered-word intervals, capped at 180 days, and schedules forgotten words for the next day. It is a simple documented MVP heuristic, not a validated memory model. Browser text-to-speech depends on installed voices and provides playback only.

The vocabulary deck (`src/lib/vocabulary.ts`) has 48 author-written words across the six onboarding topics, each with Thai meaning, example, and Thai example. The queue shows due reviews first, then unseen words from the learner's onboarding topics, limited to ten new words per Bangkok calendar day across all topics. A review records when its word was first introduced; reviews saved before this field existed do not count toward the daily limit. Deck words avoid placement-check answer words so practice does not inflate a retake; `reliable` and `remind` are older exceptions.

## PWA and caching

The worker caches an explicit allowlist: offline HTML, the logo, and app icons. It never writes route HTML, RSC payloads, session responses, assessment state, or API responses to Cache Storage. Navigation uses the network and falls back to public offline HTML on network failure. A cached application shell is intentionally absent; lessons and Google sign-in require connectivity. Browser-local saved data is retained offline.

Protected pages and API routes receive no-store headers. The service worker itself is served without caching. Old versions of this application's public cache are removed on activation; unrelated caches are preserved. HTTPS or localhost is required for service-worker support. Manifest and assets alone do not verify an OS install prompt; verify actual installation on target browsers.

## AI boundary and future backend

There are no AI calls or simulated responses. The AI page identifies unavailable features. `AIGateway` and response schemas reserve a server-side boundary for tutor/examiner calls. Implement authentication, bounded inputs, structured validation, timeouts, persistent rate limits, provider budgets, prompt-injection handling, and evidence review before enabling an endpoint. Never base pronunciation scoring on transcription alone.

There is no separate backend service. Server work (Auth.js, AI gateway, validation, rate limiting, scheduled jobs) runs in Next.js Route Handlers and Server Actions. Durable storage will be managed PostgreSQL behind `ProgressRepository`, with schema migrations, once multi-user or cross-device persistence is needed; Redis is added only for justified rate limiting. This replaces the earlier Java 21/Spring Boot plan.

Keep scoring, scheduling, and lesson selection as framework-free pure functions so a separate service could replace an implementation later without UI changes. Revisit a separate backend only for native or other clients sharing the API, work beyond serverless execution limits, persistent WebSocket connections, or cost at scale.

Speaking practice is phased: push-to-talk turns through a Next.js route (STT, model, TTS) first; then real-time sessions where the server mints a short-lived provider token with server-set instructions and limits and the browser connects directly; and only if that proves insufficient, a small Go voice relay service. Microphone access is currently disabled by `Permissions-Policy` and must be enabled for the learner workspace when speaking ships.

## Accessibility and visual design

Warm surfaces, lavender/mint accents, CSS book illustrations, reusable cards, responsive navigation, labeled native controls, skip navigation, live feedback, focus outlines, and reduced-motion overrides. Fonts use an offline-safe system stack with Inter/Noto Sans Thai preferences and Windows Thai fallbacks. Light/dark modes apply to the learner workspace. Welcome and login intentionally keep a consistent light appearance.

Automated responsive tests check horizontal overflow at desktop and Pixel 7 sizes. Manual browser review complements these checks; full WCAG conformance, real screen-reader testing, and target-device PWA installation are not claimed.
