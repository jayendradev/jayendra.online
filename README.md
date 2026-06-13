# jayendra.online

Portfolio + hire-me site for **Jayendra** — production web apps, portals, Shopify tools, and AI SEO workflows.

## Progressive Web App (Android & iOS)

Installable as a home-screen app after deploy over **HTTPS** (required).

- **Manifest:** `src/app/manifest.ts`
- **Icons:** `public/icons/` (auto-generated from `team.png` on `npm run build`)
- **Offline:** `/offline` fallback when cached pages aren’t available
- **Install prompt:** banner on mobile (Chrome “Install” / iOS Share → Add to Home Screen)

Regenerate icons after changing `team.png`:

```bash
npm run icons
```

**iOS:** Open in **Safari** → Share → **Add to Home Screen**.  
**Android:** Chrome menu → **Install app** (or use the on-site Install banner).

PWA service worker is **disabled in `npm run dev`**; test install with `npm run build && npm start` on HTTPS (or production on Vercel).

## Stack

- **Frontend:** Next.js 16 (App Router) + Tailwind CSS + PWA
- **Backend:** Next.js API routes + PostgreSQL (SQLite fallback for local dev)
- **Auth:** Cookie sessions (JWT) for clients and admin
- **Deploy:** VPS, Railway, or any Node host with PostgreSQL

## Pages

| Route        | Purpose                              |
| ------------ | ------------------------------------ |
| `/`          | Home, CTA, project preview           |
| `/work`      | Case studies                         |
| `/services`  | Outcome-based services               |
| `/about`     | Story, stack, timezone               |
| `/contact`   | Register / log in to send a message  |
| `/register`  | Create client account                |
| `/login`     | Log in                               |
| `/messages`  | Client inbox — send & read replies   |
| `/admin`     | Admin inbox — reply to clients       |

## Setup

```bash
npm install
cp .env.example .env.local
# Edit .env.local with your email and project URLs
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Messaging (replaces live chat)

1. Client **registers** at `/register`
2. Client sends a message at `/messages`
3. You get an **email** notification
4. You **log in** at `/admin` and reply
5. Client sees your reply at `/messages`

### Auth & admin (add to `.env.local`)

```env
AUTH_SECRET=use-a-long-random-string-here
ADMIN_EMAIL=contact@jayendra.online
ADMIN_PASSWORD=your-strong-admin-password
```

Admin account is created automatically from `ADMIN_EMAIL` + `ADMIN_PASSWORD` on first run.

### Email notifications

**Resend (recommended)** — add to `.env.local`:

```env
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=contact@jayendra.online
CONTACT_EMAIL=contact@jayendra.online
```

**Gmail SMTP (fallback)** — used if Resend is not configured:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=contact@jayendra.online
SMTP_PASS=your-google-app-password
SMTP_FROM=contact@jayendra.online
CONTACT_EMAIL=contact@jayendra.online
```

Create a Google [App Password](https://myaccount.google.com/apppasswords) (2FA required).

### Database

**Production:** PostgreSQL database `jayendraonline`

Add to `.env.local` (password never goes in git):

```env
# Option A — all in one URL
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/jayendraonline

# Option B — password separate
POSTGRES_HOST=your-db-host.com
POSTGRES_PORT=5432
POSTGRES_USER=your_db_user
POSTGRES_PASSWORD=your_db_password
POSTGRES_DB=jayendraonline
POSTGRES_SSL=true
```

Initialize table (optional — app auto-creates on first submit):

```bash
psql "$DATABASE_URL" -f scripts/init-postgres.sql
```

**Local dev without Postgres:** omit `DATABASE_URL` / `POSTGRES_*` → uses SQLite at `data/messages.db`.

Read SQLite messages locally:

```bash
sqlite3 data/messages.db "SELECT id, name, email, created_at FROM contact_messages ORDER BY id DESC LIMIT 10;"
```

Read PostgreSQL messages:

```bash
psql "$DATABASE_URL" -c "SELECT id, name, email, created_at FROM contact_messages ORDER BY id DESC LIMIT 10;"
```

## Photo (small avatar)

Replace the placeholder with your own image (same path):

```text
public/team.png     # preferred (your file)
public/avatar.jpg   # or .png / .webp
```

Shown small on Home, About, and Footer—not a large hero portrait. Remove files to fall back to initials **J**.

## Customize

- **Copy & projects:** `src/lib/projects.ts`, `src/lib/services.ts`, `src/lib/site.ts`
- **Email / Calendly:** `.env.local`
- **Colors:** `src/app/globals.css` (`--accent`, etc.)

## Build

```bash
npm run build
npm start
```

Separate from TheBriefWire — do not merge repos.
