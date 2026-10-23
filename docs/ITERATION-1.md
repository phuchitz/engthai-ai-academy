# Iteration 1 — Foundation and preliminary learner journey

## Completed

Built the first application in the existing empty repository. Implemented a responsive Next.js learning experience, real Auth.js Google configuration, server-side protected routes, multiple-goal onboarding, a resumable adaptive recognition assessment, transparent result limits, six practice lessons, local review scheduling, XP/streaks, analytics, settings, data export, and a conservative PWA offline fallback. Added CI, unit/component tests, desktop/mobile browser tests, and deployment instructions.

AI tutoring, speech, a durable backend, and cloud synchronization are future work. Their presence is not simulated. This is a working frontend MVP iteration, not a completed five-sprint product.

## Important files

- `src/auth.ts`, `src/app/actions.ts`, `src/app/learn/[[...segments]]/page.tsx`: authentication and protected entry.
- `src/components/`: application shell, reusable UI, and individual learning screens.
- `src/lib/assessment.ts`, `src/lib/questions.ts`: draft bank and documented scoring/selection.
- `src/lib/learning.ts`, `src/lib/storage.ts`, `src/lib/models.ts`: learning logic, persistence contract, and validation.
- `public/sw.js`, `src/app/manifest.ts`, `public/icons/`: PWA boundaries and icons.
- `src/test/`, `e2e/`, `.github/workflows/ci.yml`: verification and CI.
- `.env.example`, `README.md`, `docs/`: configuration, audit, decisions, methodology, and release instructions.

## Initial audit and blockers

The initial checkout had no application or test infrastructure. There were no incomplete source files to fix and no source ZIPs to compare. This iteration establishes the foundation rather than replacing existing work.

The remaining external blockers are Google Cloud OAuth configuration, a live login/logout verification, and an authorized Vercel project/deployment. The question bank also needs independent language educator review before any validated-placement claim.

## Verification record

Final local results:

| Check                     | Result                                                                                                                                     |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `npm ci --no-fund`        | Passed; clean lockfile installation                                                                                                        |
| `npm run lint`            | Passed without warnings                                                                                                                    |
| `npm run format:check`    | Passed                                                                                                                                     |
| `npm run typecheck`       | Passed                                                                                                                                     |
| `npm run test:coverage`   | 29 tests passed across five files                                                                                                          |
| Core logic coverage       | 100% lines; 98.64% branches across assessment, learning, storage, and redirects                                                            |
| `npm run build`           | Passed; production routes generated                                                                                                        |
| `npm audit --omit=dev`    | Zero reported vulnerabilities                                                                                                              |
| Playwright desktop/mobile | Eight journey/layout/auth/offline cases passed; two data-recovery cases passed on focused rerun after correcting an ambiguous test locator |
| `git diff --check`        | Passed                                                                                                                                     |

Screenshots under `docs/screenshots/` show welcome, dashboard, and dark vocabulary layouts at desktop/mobile sizes. GitHub-hosted CI has not run because changes have not been pushed.

Early verification found and fixed unescaped JSX, the time calculation's lint violation, missing imports after splitting components, and a duplicate top-level heading on Settings. A cold component-test run exceeded its initial five-second timeout; bounded worker concurrency and a fifteen-second UI test timeout allow the Windows environment to complete it. The final recovery test initially matched Next.js's route announcer as well as the app alert; scoping it to the main landmark fixed the test selector without a product change.

Windows sandboxing blocks Vite/Next child-process creation (`spawn EPERM`); tests and the production build are run with approved process permissions. This is an execution-environment requirement, not a production authentication bypass.

ESLint 10 was tested for compatibility, but current transitive lint plugins reject its peer range. The lockfile therefore retains ESLint 9.39.5. npm marks that major as unsupported; update the lint ecosystem together once compatible releases are available. No runtime dependency change is needed for this limitation. No Java/JaCoCo or SonarQube configuration exists to run.

## Known limitations

- No actual Google OAuth flow has been completed without owner credentials.
- No verified live deployment, GitHub PR, or remote CI run is claimed.
- Assessment content/rules are draft and unvalidated. Three of six skill areas are measured, using recognition tasks only.
- The six short lessons offer foundation practice, not a full A1–C2 curriculum. Most collected goals/topics await expanded content.
- Learning progress is unencrypted browser-local data with last-writer-wins cross-tab behavior and no synchronization, import, assessment history, or durable backup. Export contains loaded state, not recovery of damaged records.
- Lesson review does not award additional XP or extend streaks; vocabulary review currently awards no XP. Daily minutes are estimates.
- Speech playback depends on installed browser voices. AI, listening assessment, writing/speaking assessment, transcription, and pronunciation scoring are unavailable.
- Real-device PWA installation, Safari/iOS behavior, and full assistive-technology accessibility need manual validation. Offline navigation shows a public fallback; it does not load private lessons offline.

## Deployment status

Prepared for a standard Vercel Next.js deployment. No deployment has been executed and there is no verified live URL. No `.env.local`, OAuth secret, Vercel token, or AI key is committed.

## Next actions and release gate

1. Configure OAuth variables in the intended environment. Register its exact Google callback URI.
2. Complete Google login, first-login onboarding, account switching, expired-session access, and logout against a real verified Google account.
3. Review draft items and scoring with an English educator; retain explicit evidence limitations until validation exists.
4. Import the repository into an authorized Vercel project; run CI and a preview deployment. Verify the canonical URL, HTTPS, auth cookies, and private-cache headers there.
5. Verify real-device installation, keyboard navigation, reduced motion, Thai rendering, storage-denied recovery, and iOS/Safari behavior.
6. Obtain production release authorization before promoting the verified preview. No production merge or deployment is part of this iteration.
