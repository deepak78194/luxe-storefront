# Luxe Storefront

> **Production-grade luxury fashion ecommerce storefront** built with Angular 21, Tailwind CSS v4, Sanity.io v3, SSR, and WhatsApp-native checkout.

## Tech Stack

| Layer        | Technology                                   |
|--------------|----------------------------------------------|
| Framework    | Angular 21 — Standalone Components + Signals |
| Styling      | Tailwind CSS v4 (CSS-first config)           |
| CMS          | Sanity v3 (GROQ queries, image transforms)   |
| Deployment   | Cloudflare Pages                             |
| SSR          | Angular SSR (Express engine)                 |
| Ordering     | WhatsApp (`wa.me`) deep-link integration     |

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set environment variables
#    Edit src/environments/environment.ts
#    Replace YOUR_SANITY_PROJECT_ID with your actual project ID

# 3. Start dev server
npm start
# → http://localhost:4200
```

---

## Sanity CMS Setup

```bash
# 1. Install Sanity CLI (if not installed)
npm i -g sanity

# 2. Initialise a new project at sanity.io and copy the project ID
#    Update sanity-studio/sanity.config.ts  →  projectId: 'YOUR_ID'
#    Update src/environments/environment.ts →  sanityProjectId: 'YOUR_ID'

# 3. Start the Sanity Studio locally
cd sanity-studio
npm install
npx sanity dev
# → http://localhost:3333

# 4. Deploy Sanity Studio to hosted URL (optional)
npx sanity deploy
```

### CMS schemas

| Schema      | Fields                                                               |
|-------------|----------------------------------------------------------------------|
| `product`   | name, slug, price, originalPrice, images, category, variants, tags  |
| `category`  | name, slug, description, image, order                               |
| `testimonial` | name, handle, avatar, rating, text, product, verified, date      |

---

## Build & Deploy to Cloudflare Pages

### Static build (recommended for Cloudflare Pages)

```bash
npm run build:prod
# Output: dist/ecommerce/browser/
```

### Deploy via Cloudflare dashboard

1. Go to https://dash.cloudflare.com → **Pages** → Create a project
2. Connect your Git repository
3. Set build command: `npm run build:prod`
4. Set build output directory: `dist/ecommerce/browser`
5. Add environment variable: `NODE_VERSION = 20`
6. Click **Save and Deploy**

### Deploy via Wrangler CLI

```bash
npm i -g wrangler
wrangler pages deploy dist/ecommerce/browser --project-name luxe-storefront
```

The `wrangler.toml` at the project root contains all required config.

### Cloudflare Pages SPA redirect

The `wrangler.toml` already includes:
```toml
[[redirects]]
from   = "/*"
to     = "/index.html"
status = 200
```
This ensures client-side routing works correctly.

---

## Project Structure

```
src/
├── app/
│   ├── app.component.ts          Root component (router-outlet)
│   ├── app.config.ts             Providers (router, http, hydration)
│   ├── app.config.server.ts      SSR providers
│   ├── app.routes.ts             Single home route, lazy-loaded
│   ├── core/
│   │   ├── models/               TypeScript interfaces
│   │   └── services/             cart, wishlist, whatsapp, product, sanity, ui-state
│   ├── components/
│   │   ├── navbar/
│   │   ├── hero/
│   │   ├── featured-collections/
│   │   ├── product-catalog/
│   │   ├── filter-drawer/
│   │   ├── product-card/
│   │   ├── product-modal/
│   │   ├── about/
│   │   ├── testimonials/
│   │   ├── contact/
│   │   ├── footer/
│   │   ├── cart-drawer/
│   │   └── whatsapp-fab/
│   └── pages/
│       └── home/                 HomePageComponent — composes all sections
├── environments/
│   ├── environment.ts
│   └── environment.prod.ts
├── styles/
│   └── global.css               Tailwind v4 design system
├── index.html
├── main.ts
├── main.server.ts
└── server.ts

sanity-studio/
├── sanity.config.ts
└── schemas/
    ├── product.ts
    ├── category.ts
    └── testimonial.ts

wrangler.toml
```

---

## WhatsApp Integration

Products and the cart drawer have **"Order on WhatsApp"** buttons. They construct a `wa.me` URL with a pre-filled message:

```
https://wa.me/919876543210?text=...
```

To change the phone number update:
- `src/environments/environment.ts` → `whatsappPhone`
- `src/app/core/services/whatsapp.service.ts` (injected from environment)

---

## Design System

All design tokens live in `src/styles/global.css` inside `@theme {}` (Tailwind v4 CSS-first config). Key tokens:

| Token            | Value       | Usage                  |
|------------------|-------------|------------------------|
| `--color-primary`  | `#0F766E`   | Brand / CTAs           |
| `--color-accent`   | `#F59E0B`   | Stars, highlights       |
| `--color-cta`      | `#25D366`   | WhatsApp green          |
| `--color-secondary`| `#F8F5F0`   | Section backgrounds     |
| `--font-heading`   | Playfair Display | Headings          |
| `--font-body`      | Inter        | Body text              |

---

## Environment Variables

| Variable           | File                    | Description              |
|--------------------|-------------------------|--------------------------|
| `sanityProjectId`  | `environment.ts`        | Sanity project ID        |
| `sanityDataset`    | `environment.ts`        | `production` or `staging`|
| `whatsappPhone`    | `environment.ts`        | Phone with country code  |
| `storeName`        | `environment.ts`        | Store display name       |

---

## License

MIT
