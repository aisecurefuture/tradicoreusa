---
name: project-tradicoreusa
description: TradiCore USA React frontend project — setup, phases, file structure, and build context
metadata:
  type: project
---

TradiCore USA is a full React frontend for a premium wood products company (IL LLC).
Working directory: `/Users/patrickkelly/Documents/tradicoreusa/web/` (Vite React app).

**Why:** Building a multi-phase e-commerce/catalog frontend for Alan Pan & Mohammad Akhtar (TradiCore LLC).

**How to apply:** When working on this project, always `cd` to `web/` first. All source is under `web/src/`.

## Tech stack
- React + Vite, React Router v6, Tailwind CSS v3, Axios
- Context API: CartContext, AuthContext, ToastContext (all in `src/context/`)
- Env vars via `VITE_` prefix (see `.env.example`)

## Build phases
1. ✅ Project setup + file structure + mock data + context/state
2. Nav, Footer, HomePage, PDF download links
3. Product listing + product detail pages
4. Tropical hardwood species pages
5. Cart + Checkout UI (Stripe/PayPal/ACH stubs)
6. Auth pages (Login, Register)
7. Account dashboard
8. Trade account page + Contact/Quote forms
9. Remaining pages (About, FAQ, Doors, 404)

## Key data files
- `src/data/mockData.js` — 36 moulding products across 9 categories
- `src/data/speciesData.js` — 12 Suriname tropical hardwood species
- `src/data/doorData.js` — door catalog (all comingSoon: true)

## Brand
- Navy #0D2137, Gold #C9A84C, Cream #FAF7F2
- Fonts: Playfair Display (heading), Inter (body)
- Two product lines: MDF moulding (Jiraw supplier) vs tropical hardwood (Suriname direct)
- Hardwood section uses warmer earthy tones; moulding section uses blue/white/clean

## Source PDFs (in parent directory)
Jiraw catalogs, TradiCore presentation, whitepaper, species guide — use for content.

## Contacts
Alan Pan (224) 715-6452, Mohammad Akhtar (847) 505-3302, tradicoreusa@gmail.com
Address: 1100 Sheridan Rd., Unit 5, Winthrop Harbor, IL 60096
