# Flora

Flora is a mobile-first plant discovery app for tracking, mapping, and sharing plant sightings. It combines a public discovery experience with personal plant tracking, search, leaderboards, and a contributor-friendly Supabase backend.

This repository is open source and actively evolving. If you want to contribute, this README is meant to get you from clone to meaningful PR without needing tribal knowledge.

## What Flora includes

- Public landing page and map experience
- Plant discovery feed with images, locations, and contributor info
- Personal dashboard for tracked plants
- Search by plant name, PID, description, contributor, and location context
- Community leaderboard
- Plant creation flow with image upload and geolocation
- AI-assisted plant description generation with Gemini

## Tech stack

- Next.js 15 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase Auth, Postgres, and Storage
- Drizzle ORM + SQL migrations
- React Query
- React Hook Form + Zod
- Leaflet / React Leaflet
- Framer Motion + GSAP

## Project structure

```text
src/
  app/                  Next.js routes, API routes, metadata, auth wiring
  components/           Shared and route-level UI
  db/                   Drizzle schema
  lib/                  Shared helpers and constants
  server/               Server-side domain logic, validation, storage, auth
scripts/                Local utility scripts
setup/                  Setup notes for external integrations
supabase/migrations/    SQL migrations, RLS, functions, and RPCs
```

## Prerequisites

Please use:

- Node.js 20+
- pnpm
- A Supabase project
- A Gemini API key for AI-generated plant descriptions

## Getting started

1. Clone the repo

```bash
git clone <your-fork-or-repo-url>
cd flora
```

2. Install dependencies

```bash
pnpm install
```

3. Create a local `.env`

Copy `.env.example` to `.env`, then replace the placeholder values with your own project credentials:

```bash
cp .env.example .env
```

4. Apply database changes

For a fresh Supabase project, run:

```bash
pnpm db:migrate
pnpm db:apply
```

What these do:

- `db:migrate` applies Drizzle-managed schema migrations
- `db:apply` applies raw SQL required for RLS, helper functions, and leaderboard RPCs

5. Start the app

```bash
pnpm dev
```

Then open `http://localhost:3000`.

## Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Public client key used by the browser and server SSR client |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Required for trusted server actions like storage upload and admin-side operations |
| `DATABASE_URL` | Yes | Direct Postgres connection used by Drizzle and migration tooling |
| `NEXT_PUBLIC_SITE_URL` | Yes | Canonical site URL for metadata, redirects, sitemap, and SEO |
| `GEMINI_API_KEY` | Optional but recommended | Enables AI-generated plant descriptions |
| `SUPABASE_PLANT_IMAGES_BUCKET` | Optional | Overrides the default storage bucket name (`plants`) |

## Available scripts

```bash
pnpm dev         # Start local development server
pnpm build       # Production build
pnpm start       # Run production build locally
pnpm lint        # Run ESLint
pnpm test        # Run server-side tests
pnpm db:generate # Generate Drizzle migrations
pnpm db:migrate  # Apply Drizzle migrations
pnpm db:push     # Push schema directly with Drizzle
pnpm db:apply    # Apply manual Supabase SQL migrations / RLS
pnpm db:studio   # Open Drizzle Studio
pnpm db:check    # Check migration drift
```

## Contribution workflow

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contributor conventions and PR expectations.

1. Fork the repo
2. Create a feature branch
3. Make a focused change
4. Run the relevant checks
5. Open a PR with clear notes, screenshots, and migration details if applicable

Recommended branch naming:

```text
feat/map-filters
fix/mobile-plant-form
chore/readme-refresh
```

## Before opening a PR

Please try to cover the basics:

```bash
pnpm lint
pnpm test
pnpm exec tsc --noEmit
```

If your change touches schema, auth, storage, or policies:

- mention the database impact in the PR
- include any required migration files
- explain whether contributors need to run `pnpm db:migrate`, `pnpm db:apply`, or both

If your change touches UI:

- test mobile first
- include screenshots or a short screen recording
- note any responsive behavior changes

## Database notes

The current schema centers on the `plants` table in [src/db/schema.ts](./src/db/schema.ts).

Important backend behavior:

- Plant IDs use a generated public PID via a Postgres helper
- Latitude and longitude are range-checked in the schema
- Supabase RLS and SQL functions live under `supabase/migrations/`
- Leaderboard data is served through a SQL RPC with a code fallback

If you add or change schema:

1. Update the Drizzle schema
2. Generate or add the migration
3. Update any matching raw SQL if RLS, functions, or RPCs need changes
4. Verify the app still works against a clean database

## Auth and storage notes

- Authentication uses Supabase OAuth/session handling
- Plant image uploads go through Supabase Storage
- Public plant images are loaded through Next.js remote image config
- Service-role access must stay server-only

Please do not:

- commit real secrets
- expose service-role keys to the client
- rely on client-side checks alone for protected actions

## AI integration

Flora can generate short plant descriptions through Gemini.

See:

- [setup/GEMINI_SETUP.md](./setup/GEMINI_SETUP.md)

The app falls back to predefined descriptions when Gemini is unavailable.

## Design and product expectations

Flora is intended to feel clean, useful, and mobile-first rather than flashy. When contributing UI work:

- optimize for mobile first, then scale up
- keep spacing and border radii consistent
- preserve real usability over decorative complexity
- prefer existing component patterns over introducing a new visual system

## Accessibility expectations

Please keep accessibility in scope for every UI PR:

- keyboard reachable controls
- visible focus states
- semantic buttons, labels, and headings
- helpful loading and error states
- no misleading UI copy

## Troubleshooting

### `pnpm db:migrate` fails

Check:

- `DATABASE_URL` is present
- your Supabase database is reachable
- your password is URL-safe or correctly escaped

### Auth redirects behave strangely

Check:

- `NEXT_PUBLIC_SITE_URL` matches your local or deployed URL
- Supabase Auth redirect URLs include your app URL and callback route

### Images fail in `next/image`

Check:

- `NEXT_PUBLIC_SUPABASE_URL` is correct
- the image comes from your Supabase storage public path
- the bucket is public if you expect public rendering

### AI descriptions always fall back

Check:

- `GEMINI_API_KEY` is set
- the Gemini API key has access enabled
- your server logs for provider errors

## Security

If you find a security issue, please avoid posting exploit details in a public issue. Reach out privately to the maintainer first if possible.

At minimum, please include:

- affected area
- reproduction steps
- impact
- suggested mitigation if you have one

## License

[MIT](./LICENSE)
