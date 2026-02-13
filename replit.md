# ClientOps CRM - replit.md

## Overview

ClientOps is a premium lead management CRM (Customer Relationship Management) web application built for managing leads generated from website contact forms. It features a polished glassmorphism UI with light/dark theme support, animated backgrounds, real-time dashboard analytics, and full CRUD operations for leads, notes, and activities. The app uses a crimson red (#E61E32) accent color scheme with a black/white/steel grey palette.

Key features:
- User authentication (login/logout with session-based auth)
- Lead management (create, read, update, delete leads)
- Notes and activity tracking per lead
- Dashboard with stats cards, charts, and recent activity feeds
- Analytics page with recharts visualizations
- Animated canvas background across all pages
- Premium loading/splash screen with minimum duration
- Light and dark mode with glassmorphism effects

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, built using Vite
- **Routing**: wouter (lightweight React router)
- **State Management**: TanStack React Query for server state; no dedicated client state library
- **UI Components**: shadcn/ui component library (new-york style) built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming, custom glassmorphism utility classes
- **Animations**: Framer Motion for page transitions, loading screens, and UI animations; HTML Canvas for animated background
- **Charts**: Recharts for dashboard and analytics visualizations
- **Forms**: react-hook-form with zod validation via @hookform/resolvers
- **Theming**: next-themes for light/dark mode toggle with localStorage persistence
- **Path aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`, `@assets/` maps to `attached_assets/`

### Backend Architecture
- **Runtime**: Node.js with Express 5
- **Language**: TypeScript, executed via tsx
- **API Pattern**: RESTful JSON API under `/api/` prefix
- **Authentication**: Passport.js with local strategy, express-session for session management, scrypt for password hashing
- **Session Store**: connect-pg-simple (PostgreSQL-backed sessions)
- **API Contract**: Shared route definitions in `shared/routes.ts` with Zod schemas for request/response validation — used by both client and server

### Data Storage
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM with drizzle-zod for schema-to-validation integration
- **Schema Location**: `shared/schema.ts` (shared between client and server)
- **Migrations**: Drizzle Kit with `drizzle-kit push` for schema synchronization
- **Tables**:
  - `users` — id, username, password (hashed), name, adminCode, email, createdAt
  - `leads` — id, name, email, source, status, followUpDate, notes, createdAt, updatedAt
  - `notes` — id, leadId (FK to leads), content, createdAt
  - `activities` — id, leadId (FK to leads), type, description, createdAt
- **Relations**: leads have many notes and activities (defined via Drizzle relations)

### Build System
- **Development**: `tsx server/index.ts` runs the Express server which sets up Vite dev server as middleware for HMR
- **Production Build**: Custom build script (`script/build.ts`) that runs Vite for client and esbuild for server, outputting to `dist/`
- **Server in dev**: Vite middleware mode via `server/vite.ts`; in production, static files served from `dist/public`

### Project Structure
```
client/             — Frontend React application
  src/
    components/     — Reusable UI components (layout, stat-card, leads-table, etc.)
    components/ui/  — shadcn/ui primitives (button, card, dialog, etc.)
    hooks/          — Custom React hooks (use-auth, use-leads, use-notes, etc.)
    lib/            — Utilities (queryClient, utils)
    pages/          — Page components (dashboard, leads, analytics, login, etc.)
server/             — Backend Express application
  auth.ts           — Passport authentication setup
  db.ts             — PostgreSQL connection pool and Drizzle instance
  routes.ts         — API route handlers + database seeding
  storage.ts        — Data access layer (IStorage interface + DatabaseStorage)
  static.ts         — Production static file serving
  vite.ts           — Vite dev server integration
  index.ts          — Express app entry point
shared/             — Code shared between client and server
  schema.ts         — Drizzle table definitions + Zod schemas
  routes.ts         — API contract definitions with Zod validation
migrations/         — Drizzle migration files
attached_assets/    — Static assets (logo, requirement docs)
```

### Design Decisions
1. **Shared schema and route contracts**: Both frontend and backend import from `shared/` to ensure type safety and consistent validation across the stack. The API contract in `shared/routes.ts` defines paths, methods, and Zod schemas for all endpoints.
2. **Storage abstraction**: `server/storage.ts` defines an `IStorage` interface, with `DatabaseStorage` as the PostgreSQL implementation. This makes it possible to swap storage backends.
3. **Database seeding**: On startup, `server/routes.ts` seeds an admin user and sample leads if the database is empty.
4. **Session-based auth over JWT**: Uses express-session with PostgreSQL session store for simplicity and security in a server-rendered context.
5. **Glassmorphism UI**: The design heavily uses backdrop-filter blur, semi-transparent backgrounds, and layered shadows. Custom CSS classes like `glass-card` are defined in `index.css`.

## External Dependencies

### Database
- **PostgreSQL** — Primary database, connected via `DATABASE_URL` environment variable
- **connect-pg-simple** — PostgreSQL session store for express-session
- **Drizzle ORM + drizzle-kit** — ORM and migration tooling

### Key npm Packages
- **express** (v5) — HTTP server
- **passport + passport-local** — Authentication
- **express-session** — Session management
- **@tanstack/react-query** — Server state management
- **framer-motion** — Animations
- **recharts** — Chart components
- **react-hook-form + zod + @hookform/resolvers** — Form handling and validation
- **next-themes** — Theme management (light/dark mode)
- **wouter** — Client-side routing
- **date-fns** — Date formatting
- **lucide-react** — Icon library
- **shadcn/ui ecosystem** — Radix UI primitives, class-variance-authority, clsx, tailwind-merge

### Environment Variables Required
- `DATABASE_URL` — PostgreSQL connection string (required)
- `SESSION_SECRET` — Session encryption key (falls back to default in development)

### Replit-Specific Integrations
- `@replit/vite-plugin-runtime-error-modal` — Runtime error overlay in development
- `@replit/vite-plugin-cartographer` — Dev tooling (dev only)
- `@replit/vite-plugin-dev-banner` — Dev banner (dev only)