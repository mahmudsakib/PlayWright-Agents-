# F1T Cloud — Test Plan (Concise)

Generated: November 9, 2025
Based on: https://f1tcloud.f1tdemo.xyz/login (login page snapshot) and standard gym-management workflows.

## Purpose
This test plan targets the F1T Cloud web application. It focuses on authentication, basic post-login flows, and critical functional paths that should be covered by automation and manual testing. The content below is derived from the login page snapshot and general product knowledge; areas inside the application should be explored further to refine and extend scenarios.

## Assumptions
- I inspected the login page snapshot (Email, Password, Submit, Cancel, Forgot password).
- I have not crawled or authenticated into protected pages in this session. The plan therefore treats post-login sections at a high level and proposes exploratory steps to map features.
- Provided credentials may be used for manual or automated login validation if you permit. Do not store credentials in source control.

## Scope
In-scope for initial test plan:
- Authentication: Login, validation, error messages, password recovery link
- Session handling: session timeout, sign out
- Primary user journeys (post-login, exploratory): dashboard access, member/customer management, class/schedule management, payments/billing, reports
- UI basics: responsive behavior, input validation, accessibility of login form
- Alerts & notifications shown on login page

Out-of-scope (until deeper exploration):
- Third-party integrations (payment gateways, SMS/email providers) — need to map endpoints
- Deep API contract testing — not yet discovered

## Primary user types / personas
- Admin / Owner: full access to configuration, billing, reports
- Staff / Manager: manage members, classes, schedules
- Trainer: view assigned classes and members
- Member: view classes and personal bookings (if user-facing portal exists)

(Concrete roles and permissions must be verified by exploring the authenticated UI.)

## Critical acceptance criteria
- Valid user can sign in and arrive at the main dashboard within acceptable time (< 5s under normal network conditions).
- Invalid credentials produce a clear, accessible error message and do not create a session.
- "Forgot your password" opens the recovery flow (page or modal) and accepts an email to trigger a reset.
- Session ends on explicit sign out; protected pages redirect to login when unauthenticated.
- Login inputs enforce required validation and have accessible labels/placeholders.

## Test data recommendations
- Reusable test account(s) for each persona. Use timestamped accounts for signup tests.
- Test cards / billing stubs for sandbox or test-mode payments (do not use real card data in CI).
- Edge-case data: very long names, non-ASCII characters, missing required fields.

## Risk & constraints
- If the app launches network requests to different domains, tests may need network allowances or stubs.
- Avoid committing credentials to repo — use environment variables or Playwright storageState files for CI.

## Automation priorities
- P0 (smoke/CI): Login happy path, invalid login error, session redirect on logout, place-holder purchase flow (if present), critical dashboard load
- P1: Forgot password flow, basic CRUD for members/classes, add-to-cart/pay billing flows, role-based access checks
- P2: Accessibility checks, performance smoke, cross-browser visual regression

## Test environment & tools
- Playwright for UI automation (Chromium/Firefox/WebKit)
- Use `storageState` fixtures to reuse authenticated state
- CI: Run smoke suite on PRs; schedule full regression nightly

## Test Strategy: how we'll test
- Start each test from a blank browser state (incognito/clear storage)
- Use ARIA/role locators and stable attributes where possible
- Prefer waiting for visible/become-hidden instead of fixed timeouts
- Centralize selectors in simple page objects (AuthModal, Dashboard, MemberList)

## Detailed Test Scenarios
Each scenario assumes a fresh browser session unless otherwise stated.

### 1 — Login: Successful login (Happy path)
Assumption: test account exists (or the plan includes signup step).
Starting state: blank browser, app at `/login`.
Steps:
1. Navigate to `https://f1tcloud.f1tdemo.xyz/login`.
2. Enter a valid email into the Email field (placeholder: "Email").
3. Enter a valid password into the Password field.
4. Click the `Submit` button.
Expected results:
- Page navigates to the dashboard or a post-login landing page.
- The page shows a `Welcome` message or user's name, and the top nav changes (e.g., a Sign out link).
- No error alerts displayed.
Success criteria: new page loads and protected resources are accessible. Failure: error message shown or still on login page.

### 2 — Login: Invalid credentials
Starting state: `/login`.
Steps:
1. Enter a non-existent email or incorrect password.
2. Click `Submit`.
Expected results:
- Login fails with a friendly, accessible error message (e.g., "Invalid email or password").
- The login form remains visible and editable.
- No session cookie is set.
Failure conditions: silent failure, or redirect to an ambiguous page.

### 3 — Login: Required-field validation
Starting state: `/login`.
Steps:
1. Leave Email blank, fill Password, click Submit.
2. Repeat leaving Password blank.
Expected results:
- Required validation messages appear next to the fields (or native HTML `required` behavior).
- Fields are labelled for screen readers; focus moves to first invalid field.

### 4 — Forgot password link
Starting state: `/login`.
Steps:
1. Click `Forgot your password?` link.
2. Verify navigation to `/forgot-password` or a modal appears requesting an email.
3. Enter a valid email and submit.
Expected results:
- The app shows a confirmation message that reset instructions were sent.
- No sensitive info is disclosed.

### 5 — Session and sign out
Starting state: authenticated session.
Steps:
1. Click Sign out (or use sign out route).
2. Try to navigate to a protected URL (e.g., `/dashboard`) in the same tab.
Expected results:
- After sign out, protected routes redirect to `/login`.
- Session cookies/localStorage are cleared (or server rejects requests).

### 6 — Dashboard smoke (post-login)
Starting state: auth success.
Steps:
1. Confirm major dashboard widgets load: counts, quick actions, notifications region.
2. Open one primary module (Members, Classes, Billing) and check initial list loads.
Expected results:
- Each module lists items or shows an empty-state message.
- No unhandled JS errors or infinite loading spinners.

### 7 — CRUD: Member (happy path)
Starting state: authenticated, Dashboard > Members.
Steps:
1. Click `Add Member` (or equivalent).
2. Fill required fields (name, email, phone), submit.
3. Verify new member appears in list and detail view.
4. Edit member and change a field; verify update.
5. Delete the member and verify removal.
Expected results:
- Each operation shows success feedback and list updates.

### 8 — Billing/Payments (if available)
Starting state: authenticated, Billing module.
Steps:
1. Create a test invoice or payment using sandbox/test credentials.
2. Verify invoice list and totals update.
Expected results:
- Payment processing in sandbox mode completes and shows confirmation.
- No real charges occur in sandbox.

### 9 — Accessibility checks (login form)
Starting state: `/login`.
Steps:
1. Confirm Email and Password fields have accessible labels.
2. Verify tab order, focus states, and that the form can be submitted by Enter.
3. Run an automated a11y check (axe or Playwright accessibility snapshot).
Expected results:
- No critical a11y violations for the login flow.

### 10 — Cross-browser smoke
- Run the smoke login and dashboard checks across Chromium, Firefox, WebKit.
- Note any rendering differences.

## Edge cases & negative tests
- SQL/JS injection strings in inputs to verify input sanitization.
- Extremely long input lengths for text fields.
- Internationalized emails / unicode characters.
- Reuse of login credentials: repeated login attempts and rate-limiting exposures.

## Automation mapping & suggested test skeletons
- tests/smoke/auth.spec.ts
  - login-success
  - login-invalid
  - forgot-password
- tests/e2e/members.spec.ts
  - member-create/edit/delete
- Use `tests/helpers/auth.ts` to produce `storageState.json` for authenticated tests.

Playwright patterns to use:
- Use `page.getByRole('textbox', { name: /Email/i })` and `getByRole('button', { name: /Submit/i })` for robust locators.
- Use `page.on('dialog', d => d.accept())` where alerts are expected.
- Prefer `expect(locator).toBeVisible({ timeout: x })` and `expect(locator).not.toBeVisible()` instead of fixed sleeps.

## CI recommendations
- Run smoke tests (login + dashboard smoke) on every PR (fast: ~ 1–2 minutes).
- Schedule full regression nightly across 3 browsers.
- Store `storageState` for stable auth or use API-level token creation to seed tests.

## Test data & cleanup
- Create a sandbox/test org or prefix test objects with `playwright-` and remove them in teardown.
- Use environment-specific test credentials; do not commit secrets. Use CI secrets or vaults.

## Next steps (discovery & refinement)
1. With permission, perform an authenticated exploratory session using provided credentials to map modules, routes, and data models.
2. Update this plan with concrete selectors and additional scenarios (e.g., Trainer schedule, Member check-in, Reports exports).
3. Implement a small smoke suite (3–5 tests) and wire to CI.

---

Files included or suggested
- `tests/smoke/auth.spec.ts` (login tests)
- `tests/e2e/members.spec.ts` (member CRUD)
- `tests/helpers/pages/auth-page.ts` (page object)

Notes: This plan was created from the login page snapshot and typical features in gym-management apps. To make the plan fully prescriptive, I recommend an authenticated exploratory pass to enumerate modules and element IDs. If you want, I can perform that exploration now using the credentials you provided and then generate a fully detailed test plan (selectors, exact routes, and runnable Playwright test skeletons).