# Arch Studio — Production-Ready Architecture Website

A premium, full-stack architecture company website built with Next.js 14 (App Router), FastAPI, and PostgreSQL.

---

## Project Structure

```
arch/
├── frontend/          # Next.js 14 (App Router)
│   ├── src/
│   │   ├── app/       # Pages + layouts
│   │   ├── components/
│   │   │   ├── animations/   # SplitText, ShinyText, GlareHover, ClickSpark, SplashCursor…
│   │   │   ├── layout/       # Navbar, Footer, ThemeProvider
│   │   │   ├── magic/        # MagicBento, AnimatedList, FlowingMenu
│   │   │   ├── sections/     # Hero, FeaturedProjects, Testimonials, CTASection…
│   │   │   ├── ui/           # Button, Input, Modal, Toaster
│   │   │   ├── portfolio/    # ProjectGallery
│   │   │   └── contact/      # ContactMap (Leaflet / OpenStreetMap)
│   │   ├── lib/       # api.ts, utils.ts, constants.ts
│   │   └── types/     # TypeScript types
│   └── public/
│       └── images/    # hero-bg.webp, about-studio.webp, team photos, map-marker.png
├── backend/           # FastAPI
│   ├── app/
│   │   ├── api/v1/endpoints/  # auth, projects, blogs, testimonials, contact, upload
│   │   ├── core/             # config, database, security
│   │   ├── models/           # SQLAlchemy ORM models
│   │   ├── schemas/          # Pydantic schemas
│   │   └── services/         # email, image processing
│   └── uploads/       # Auto-created on startup
├── docker-compose.yml
└── .env.example
```

---

## Quick Start (Local Development)

### Prerequisites

- **Node.js** 20+
- **Python** 3.12+
- **PostgreSQL** 16+ (or use Docker)
- **pnpm / npm**

---

### 1. Clone & configure environment

```bash
cd d:/arch

# Copy and edit the root env
cp .env.example .env

# Copy backend env
cp backend/.env.example backend/.env

# Copy frontend env
cp frontend/.env.example frontend/.env.local
```

Edit `backend/.env` and `frontend/.env.local` with your values.

---

### 2a. Run with Docker (recommended)

```bash
# From d:/arch/
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

---

### 2b. Run manually (without Docker)

#### Start PostgreSQL

```bash
# If you have PostgreSQL installed locally:
createdb archdb
createuser archuser
psql -c "ALTER USER archuser WITH PASSWORD 'archpass';"
psql -c "GRANT ALL PRIVILEGES ON DATABASE archdb TO archuser;"
```

#### Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start server (auto-creates tables and admin user)
python main.py
```

Backend runs at: **http://localhost:8000**
API Docs: **http://localhost:8000/docs**

#### Frontend

```bash
cd frontend

# Install dependencies
npm install --legacy-peer-deps

# Start dev server
npm run dev
```

Frontend runs at: **http://localhost:3000**

---

## Admin Panel

Navigate to **http://localhost:3000/admin/login**

Default credentials:
- Email: `admin@archstudio.com`
- Password: `AdminPass123!`

> ⚠️ Change these immediately in your `.env` before going live.

### Admin capabilities

| Section | Limits |
|---|---|
| Projects | Max **20** projects, max **5** featured |
| Testimonials | Max **10** testimonials |
| Blog | Unlimited articles |
| Images | Auto-resized + converted to WebP |

### Image upload dimensions

| Type | Dimensions |
|---|---|
| Hero | 1920 × 1080 |
| Project Cover | 1200 × 800 |
| Project Gallery | 1200 × 900 |
| Blog Cover | 1200 × 628 |
| Team / Testimonial Photo | 400 × 400 |

Images larger than 5 MB are rejected. All valid images are resized (smart crop), converted to WebP (quality 85), and a half-size thumbnail is auto-generated.

---

## Public Image Assets Needed

Place these in `frontend/public/images/`:

| File | Usage |
|---|---|
| `hero-bg.webp` | Home hero background (1920×1080) |
| `about-studio.webp` | About page (800×1000) |
| `team/elena.webp` | Team member photo (400×400) |
| `team/marcus.webp` | Team member photo (400×400) |
| `team/amara.webp` | Team member photo (400×400) |
| `team/james.webp` | Team member photo (400×400) |
| `map-marker.png` | Leaflet map marker (28×40) |
| `placeholder.webp` | Default image fallback |
| `og-image.jpg` | Social share image (1200×630) |

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/projects` | — | List projects (paginated, filterable) |
| GET | `/api/v1/projects/featured` | — | Up to 5 featured projects |
| GET | `/api/v1/projects/{slug}` | — | Single project |
| GET | `/api/v1/projects/admin/all` | Admin | All projects for admin |
| POST | `/api/v1/projects` | Admin | Create project |
| PUT | `/api/v1/projects/{id}` | Admin | Update project |
| DELETE | `/api/v1/projects/{id}` | Admin | Delete project |
| GET | `/api/v1/blogs` | — | List blogs |
| GET | `/api/v1/blogs/{slug}` | — | Single blog |
| POST | `/api/v1/blogs` | Admin | Create blog |
| GET | `/api/v1/testimonials` | — | List active testimonials (max 10) |
| POST | `/api/v1/testimonials` | Admin | Create testimonial |
| POST | `/api/v1/contact` | — | Submit contact form (rate-limited: 5/hr) |
| POST | `/api/v1/upload/image` | Admin | Upload & process image |
| POST | `/api/v1/auth/login` | — | Admin login |

---

## Features

### Design
- Gold (#C9A96E) + cream light mode, near-black dark mode
- Playfair Display serif headings + Inter sans-serif body
- Fully responsive mobile-first layout
- Dark / Light mode toggle

### Animations
- `SplitText` — word/character entrance animations
- `ShinyText` / `GradientText` — text effects
- `RotatingText` — cycling words in hero
- `CountUpAnim` — numbers count up on scroll
- `GlareHover` — 3D tilt + spotlight on project cards
- `ClickSpark` — spark particles from button clicks
- `SplashCursor` — canvas cursor trail (desktop only)
- `LogoLoop` — infinite horizontal scroll strip
- `MagicBento` — bento grid with cursor-following glow
- `AnimatedList` — staggered list entrance
- `FlowingMenu` — flowing band hover on menu items

### SEO
- Next.js App Router with SSR for all public pages
- `generateMetadata()` for dynamic page meta
- JSON-LD structured data (Project, Article)
- `sitemap.ts` — auto-generated XML sitemap
- `robots.ts` — proper robots.txt
- Open Graph + Twitter card tags

### Security
- JWT authentication for admin panel
- bcrypt password hashing
- Rate limiting on contact form (5 submissions/hour)
- Input validation with Pydantic (backend) + Zod (frontend)
- XSS sanitization via `html.escape`
- CORS configured to allowed origins only
- Security headers (X-Frame-Options, CSP, etc.)
- Image validation (type, size, content)

---

## Deployment (Free Tier)

### Option 1: Local (development)
Use the manual run instructions above.

### Option 2: Docker Compose (VPS / home server)
```bash
docker-compose -f docker-compose.yml up -d --build
```

### Option 3: Vercel (frontend) + Railway (backend + DB)
1. Push to GitHub
2. Deploy frontend on **Vercel** (free tier)
3. Deploy backend on **Railway** (free $5/month credit)
4. Use Railway's managed PostgreSQL
5. Set all environment variables in each platform's dashboard

### Option 4: Render.com
Deploy both services on Render's free tier (backend may spin down after inactivity).

---

## Environment Variables Reference

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `DATABASE_URL` | Async PostgreSQL URL |
| `SECRET_KEY` | JWT signing secret (min 32 chars) |
| `ADMIN_EMAIL` | Initial admin email |
| `ADMIN_PASSWORD` | Initial admin password |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins |
| `SMTP_*` | Email config (optional) |

### Frontend (`frontend/.env.local`)

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend URL |
| `NEXT_PUBLIC_SITE_URL` | Frontend URL (for sitemap/OG) |
| `NEXT_PUBLIC_GA_ID` | Google Analytics ID (optional) |
| `NEXT_PUBLIC_MAP_LAT/LNG` | Office map coordinates |
| `NEXT_PUBLIC_COMPANY_*` | Company contact info |

---

## License

MIT — see LICENSE file.
