# ZAID Minage — E-commerce Platform

A bilingual (Arabic/French) full-stack e-commerce platform for **ZAID Minage**,
a premium home decor and kitchenware store in Guemar, Algeria.

Built with Next.js 14 (App Router), TypeScript, Prisma/PostgreSQL, NextAuth,
Tailwind CSS, Zustand, Stripe, and Cloudinary.

---

## ⚠️ Scope note

This is a **production-shaped starter**, not an exhaustive implementation of
every item in a full spec. The core flows — bilingual storefront, cart,
checkout (COD + Stripe), order management, product/category/review/customer
admin, shipping-fee matrix, analytics — are wired end-to-end against a real
Prisma schema and are meant to run. A few things are deliberately left as
clearly-marked stubs for you or a dev team to finish before going live:

- **Cloudinary upload**: the admin product form uses a `prompt()`-based
  fallback for image URLs. Swap in `src/components/admin/image-uploader.tsx`
  (a real `next-cloudinary` drag & drop widget) once your Cloudinary account
  and unsigned upload preset are configured.
- **WhatsApp Business API** automated notifications (order confirmed /
  shipped) are not implemented — only the `wa.me` deep-link buttons are, which
  work without any API setup. Automated messages require a Meta-approved
  WhatsApp Business API integration (e.g. via Twilio or 360dialog).
- **Facebook product catalog CSV feed** and **Instagram shop tags** are not
  built — see "Not included" below.
- **Settings → Store info / Payment toggles** are UI-only; wire them to a
  `Settings` table (or a key-value store) to persist changes.
- Product photography is placeholder JPGs in `/public/placeholder-products`
  — replace with real photos.

---

## 1. Prerequisites

- Node.js 20+
- A PostgreSQL database (this project targets [Neon](https://neon.tech), but
  any Postgres works)
- A Cloudinary account (for product images)
- A Stripe account (only needed if you enable card payments)

## 2. Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy the env template and fill in real values
cp .env.example .env

# 3. Push the schema to your database and generate the Prisma client
npx prisma migrate dev --name init

# 4. Seed sample data (categories, bilingual products, all 58 wilaya
#    shipping rates, and an admin account)
npm run prisma:seed

# 5. Run the dev server
npm run dev
```

App runs at `http://localhost:3000`, redirecting to `/ar` (Arabic, RTL) by
default. Switch to French with the language toggle in the header, or visit
`/fr` directly.

### Default admin login (seeded)

```
Phone:    +213558700448
Password: ChangeMe123!
```

**Change this password immediately** in a real deployment — the seed script
exists to give you a working admin account to explore `/ar/admin` with, not
for production use.

## 3. Project structure

```
prisma/
  schema.prisma        # Full data model (User, Product, Order, etc.)
  seed.ts               # Sample categories/products/admin + shipping rates
src/
  app/
    [locale]/            # Storefront + admin pages (ar/fr)
      admin/              # Dashboard, orders, products, categories, ...
      products/[slug]/    # Product detail page
      checkout/            # 4-step checkout flow
      account/             # Login/register, order history, wishlist
    api/                  # REST API routes (products, orders, auth, ...)
  components/
    storefront/          # Cart drawer, product card, checkout flow, ...
    admin/                # Orders table, product form, charts, ...
    layout/               # Header, footer, WhatsApp button, providers
  lib/                    # prisma client, auth config, wilaya/shipping data
  store/                  # Zustand cart store
  messages/               # ar.json / fr.json translation strings
```

## 4. Key business logic

- **Stock** is deducted transactionally at order creation (not at
  "add to cart"), and re-validated server-side against live product data —
  see `POST /api/orders`.
- **Shipping fees** are calculated from a wilaya → tier (local / near / far)
  → fee matrix (`src/lib/wilayas.ts`), editable per-wilaya from
  `/admin/settings`. Orders over 10,000 DZD get free shipping.
- **COD orders** are created as `PENDING`; an admin confirms them from
  `/admin/orders` (a phone-verification call, in practice, before flipping
  status to `CONFIRMED`).
- **Stripe orders**: a Checkout Session is created at order time; a webhook
  (`/api/webhooks/stripe`) marks the order `CONFIRMED` on
  `checkout.session.completed`. A cron job
  (`/api/cron/cancel-unpaid-orders`, wired in `vercel.json` to run every 10
  minutes) auto-cancels and restocks orders left `PENDING` for 30+ minutes.
- **Reviews** are verified against `DELIVERED` orders containing the
  reviewed product, and held in an `isApproved: false` moderation queue until
  an admin approves them from `/admin/reviews`.

## 5. Environment variables

See `.env.example` for the full list with comments. At minimum for local
development you need `DATABASE_URL` and `NEXTAUTH_SECRET`
(`openssl rand -base64 32`).

## 6. Deployment (Vercel + Neon)

1. Push this repo to GitHub.
2. Create a Neon Postgres database, copy its connection string into
   `DATABASE_URL` on Vercel.
3. Import the repo into Vercel; add all `.env.example` variables as Vercel
   environment variables.
4. Run `npx prisma migrate deploy` against the production database (via a
   Vercel build step or manually) and `npm run prisma:seed` once.
5. Set your Stripe webhook endpoint to
   `https://yourdomain.com/api/webhooks/stripe` and copy the signing secret
   into `STRIPE_WEBHOOK_SECRET`.
6. Vercel Cron (configured in `vercel.json`) will hit
   `/api/cron/cancel-unpaid-orders` automatically — no extra setup needed
   beyond setting `CRON_SECRET`.

## 7. Not included (out of scope for this scaffold)

To keep this a runnable, review-able starter rather than an unmaintainable
wall of speculative code, the following spec items are **not** implemented
and would need dedicated follow-up work:

- Meta product catalog CSV feed / Instagram shop tag sync
- Automated WhatsApp Business API notifications (order confirmed/shipped)
- Transactional email (order confirmation, shipping, abandoned cart) — the
  `RESEND_API_KEY` env var is scaffolded but no email templates/sending code
  is wired up yet
- Full WCAG 2.1 AA accessibility audit (semantic structure and keyboard
  navigation basics are in place, but this needs a proper pass with a
  screen reader and axe/Lighthouse)
- Automated daily database backups (this is a Neon/hosting-provider
  configuration, not application code)
- Address book CRUD UI (the `Address` model and read-only display exist;
  add/edit/delete forms are not built)

## 8. License

Proprietary — built for ZAID Minage.
