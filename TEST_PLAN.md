# Demoblaze Test Plan (concise)

This document contains a concise test plan for https://www.demoblaze.com/ focused on core functional flows and automation candidates.

## Scope
- Functional: browse categories, product details, add to cart, cart CRUD, place order, signup/login modals, contact/about
- UI: modals, pagination, navigation, alerts
- Automation: smoke (happy path) and regression-critical flows

## Critical acceptance criteria
- Add to cart shows confirmation and cart includes selected item
- Place Order returns a purchase confirmation with order id and amount
- Login/Signup modals work for valid credentials and reject duplicates/invalid inputs

## Automation priorities
- P0 (automate first): purchase happy path, add-to-cart, login
- P1: product details, cart delete, pagination
- P2: contact modal, accessibility basics, performance baselines

## Test data
- Use timestamped usernames for signups
- Use simple dummy card details for Place Order (site does client-side confirmation)

## Playwright mapping (recommendations)
- Tests directory: `tests/smoke/` for smoke; `tests/e2e/` for broader scenarios
- Page objects: `tests/helpers/pages/` for HomePage, ProductPage, CartPage, AuthModal
- Handle alerts with page.on('dialog', d => d.accept())
- Reuse authenticated state with storageState when needed

## Quick next steps
1. Add smoke tests for purchase and login (created in `tests/smoke/`)
2. Add fixtures for auth and storageState
3. Wire CI to run smoke suite on PRs and nightly full regression

---
Generated: November 7, 2025
% TEST_PLAN

This file intentionally placed here for the demo. (Note: correct path should be `e:/OFFICE/PlayWright Agent/TEST_PLAN.md`)
