# 🛒 বাজার দর | BazarDor

**বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।**

BazarDor is a responsive Bangla market-price website. It shows today's prices of rice, lentils, oil, vegetables, fish, meat, eggs/dairy and spices, which prices went up or down, and a market-by-market price breakdown for signed-in users.

## Key features

1. **Live price ticker** – an infinite marquee under the navbar showing emoji, name, ৳/unit and ▲/▼ change (pauses on hover).
2. **Today's movers** – top 6 price risers (▲) and top 6 fallers (▼), plus a grid of all products with search. Prices use Bengali digits (১,৮৫০ টাকা).
3. **Category pages with sorting** – default / low→high / high→low, sorted by real numeric value, with skeleton loaders and a friendly 404 state.
4. **Protected product details** – minimum, maximum and average price, cheapest and priciest market, and a market-wise table. Visitors are redirected to sign in (with a toast) and sent back after logging in.
5. **Authentication with Better Auth** – email/password, Google and GitHub, toast notifications, and a profile page with an *update name* route.
6. Fully responsive (mobile → desktop), Bangla 404 and error pages, refresh-safe dynamic routes.

## Technologies

Next.js 16 (App Router) · React 19 · JavaScript · Tailwind CSS 4 · Better Auth · PostgreSQL (Neon) · react-hot-toast · Lucide React

## Run locally

```bash
npm install
cp .env.example .env.local     # then fill in the values
npm run db:migrate             # creates the Better Auth tables
npm run dev
```

Open http://localhost:3000.

## Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | yes | PostgreSQL connection string (e.g. a free [Neon](https://neon.tech) database) |
| `BETTER_AUTH_SECRET` | yes | Random secret: `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | yes | Site URL, e.g. `http://localhost:3000` or your Vercel URL |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | no | Enables Google login |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | no | Enables GitHub login |
| `BAZARDOR_API_URL` | no | Price API to try first |

OAuth callback URLs: `{BETTER_AUTH_URL}/api/auth/callback/google` and `.../github`.

## Deploy (Vercel)

1. Push to GitHub and import the repository in Vercel.
2. Add the environment variables above (`BETTER_AUTH_URL` = your production URL).
3. Run `npm run db:migrate` **once** on your computer with the Neon `DATABASE_URL` in `.env.local`.
4. Deploy. All pages render on demand, so refreshing any URL works.

## Price API

`https://api.api-store.workers.dev/api/bazardor` (fallbacks: `api.abcz.workers.dev`, `openapi.programming-hero.com`). Endpoints: `/products`, `/products?category=:slug`, `/products/:id`, `/categories`.

## Routes

| Route | Access |
|---|---|
| `/` | Public |
| `/category/[slug]` | Public |
| `/product/[slug]` | Login required |
| `/signin`, `/signup` | Public |
| `/profile`, `/profile/update` | Login required |

- **Live Link:** add after deployment
- **GitHub Repository:** add your repository URL
