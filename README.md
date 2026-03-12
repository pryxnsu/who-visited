# **WhoVisited**

WhoVisited is a website analytics tool that helps you understand how visitors interact with your site. It provides insights such as total visits, unique visitors, traffic trends, referrers, devices, and geographic location

## Features

- **One-line setup** — embed a lightweight tracking script; start collecting data in < 1 minute.
- **Real-time dashboard** — live visitor count, traffic charts, browser & OS breakdowns, top pages, and referrer sources with configurable polling intervals.
- **Site management** — register multiple sites, each with domain verification (DNS TXT, meta tag, or file upload).
- **Bot detection** — automatically flags bot traffic so your numbers stay clean.
- **Feedback system** — collect user feedback directly from the app.
- **Google OAuth** — secure sign-in powered by NextAuth.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router, React 19) |
| Language | TypeScript |
| Database | PostgreSQL via [Drizzle ORM](https://orm.drizzle.team) |
| Auth | [NextAuth.js](https://next-auth.js.org) (Google provider) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| UI Components | [Radix UI](https://www.radix-ui.com) + [shadcn/ui](https://ui.shadcn.com) |
| Charts | [Recharts](https://recharts.org) |
| Validation | [Zod](https://zod.dev) |
| Forms | [React Hook Form](https://react-hook-form.com) |
| Package Manager | pnpm |

## Getting Started

### Prerequisites

- **Node.js** ≥ 22
- **pnpm** (enabled via corepack)
- **PostgreSQL** 16+ (or use the included Docker Compose setup)

### 1. Clone the repo

```bash
git clone https://github.com/pryxnsu/who-visited.git
cd who-visited
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

| Variable | Description | Example |
|---|---|---|
| `NODE_ENV` | Environment mode | `development` / `production` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:admin@localhost:5432/postgres` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | from [Google Cloud Console](https://console.cloud.google.com) |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | from Google Cloud Console |
| `NEXTAUTH_SECRET` | Random secret for session encryption | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Canonical URL of your deployment | `http://localhost:3000` |
| `HASH_SECRET` | Secret used for hashing visitor data | any random string |
| `POSTGRES_DB` | PostgreSQL database name (Docker) | `postgres` |
| `POSTGRES_USER` | PostgreSQL user (Docker) | `postgres` |
| `POSTGRES_PASSWORD` | PostgreSQL password (Docker) | `admin` |
| `DATABASE_HOST` | Database hostname (Docker) | `database` |

### 4. Set up the database

```bash
# Generate Drizzle migration files
pnpm db:generate

# Migrate schema to the database
pnpm db:migrate
```

### 5. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Docker Deployment

A production-ready `Dockerfile` (multi-stage, standalone output) and `docker-compose.yml` are included.

```bash
# Start both the app and PostgreSQL
docker compose up -d
```

The app will be available on port **3000** and PostgreSQL on port **5432**.

## Project Structure

```
├── app/
│   ├── (auth)/login/       # Google OAuth login page
│   ├── (main)/
│   │   ├── dashboard/      # Real-time analytics dashboard
│   │   ├── sites/          # Site management & verification
│   │   ├── feedbacks/      # User feedback page
│   │   ├── settings/       # Account settings
│   │   └── setup/          # Onboarding / script setup
│   ├── api/
│   │   ├── track/          # Tracking endpoint (receives visitor data)
│   │   ├── dashboard/      # Dashboard data API
│   │   ├── sites/          # Sites CRUD API
│   │   ├── feedbacks/      # Feedbacks API
│   │   └── auth/           # NextAuth API routes
│   └── page.tsx            # Landing page
├── components/             # Reusable UI & dashboard components
├── hooks/                  # Custom React hooks (dashboard, sites, feedback)
├── lib/
│   ├── db/                 # Drizzle schema, queries & connection
│   └── ...                 # Auth, helpers, constants, API utilities
├── types/                  # TypeScript types & Zod schemas
├── drizzle/                # Database migrations
├── Dockerfile
└── docker-compose.yml
```

## Available Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start the development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start the production server |
| `pnpm lint` | Run ESLint |
| `pnpm format` | Format code with Prettier |
| `pnpm db:generate` | Generate Drizzle migration files |
| `pnpm db:migrate` | Run database migrations |

## Contact

Built by [Priyanshu](https://x.com/pryxnsu) — reach out at **priyanshuknp444@gmail.com**.
