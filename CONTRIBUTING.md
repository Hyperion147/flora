# Contributing to Flora

Thanks for contributing to Flora.

This project is mobile-first, design-sensitive, and still moving quickly, so the goal is not just to ship code, but to keep the product coherent while we do it.

## Before you start

- Read the setup steps in [README.md](./README.md)
- Make sure your local environment is working with a real Supabase project
- Sync your branch with the latest default branch before starting new work

## Workflow

1. Fork the repository
2. Create a focused branch
3. Make the smallest change that cleanly solves the problem
4. Run checks locally
5. Open a pull request with context, screenshots, and migration notes when relevant

Recommended branch names:

```text
feat/...
fix/...
chore/...
docs/...
```

## Local checks

Run the checks that match your change:

```bash
pnpm lint
pnpm test
pnpm exec tsc --noEmit
```

If your change touches database structure or policies, also verify the migration flow locally.

## UI expectations

Flora should feel clean, useful, and mobile-first.

When contributing UI work:

- design for mobile first, then scale up
- keep spacing, sizing, and border radii consistent
- prefer existing patterns over introducing a parallel visual style
- keep interactions clear and purposeful
- test responsive behavior, not just desktop

If a change affects visuals, include screenshots or a short recording in the PR.

## Database and backend changes

If you touch schema, storage, auth, or policies:

- include the migration files
- note whether contributors need `pnpm db:migrate`, `pnpm db:apply`, or both
- explain any data-impacting behavior in the PR description

Do not expose service-role access to the client.

## Copy and accessibility

Please keep product copy plain and accurate.

Also try to preserve:

- keyboard accessibility
- visible focus states
- semantic elements and labels
- honest loading, empty, and error states

## Pull request notes

A good PR should answer:

- What changed?
- Why was this change needed?
- How was it tested?
- Are there screenshots, migrations, or follow-up tasks?

## Security

Please do not commit:

- real API keys
- real database passwords
- service-role secrets

If you discover a security issue, avoid posting exploit details publicly before the maintainer has a chance to review it.

## Code style

- Keep changes scoped
- Follow the existing file structure and naming patterns
- Add comments only where they truly help
- Prefer fixing root causes over layering on UI-only workarounds

## Questions

If something is unclear, open an issue or PR draft with your assumptions. Clear context early is better than a large surprise later.
