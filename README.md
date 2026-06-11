# মাটির পশরা — Matir Poshara

A full-stack Bengali pottery & terracotta e-commerce platform built with **Next.js 16 (App Router + Turbopack)**, **MongoDB (Mongoose)**, and **Tailwind CSS v4**. It features a customer-facing storefront with authentication, cart and checkout, live order tracking, an embeddable live-chat widget, and a complete admin panel for managing products, orders, artisans, and inventory.

> **Course project — CSE471 (System Analysis and Design).**
> Author: **Ferdous Hasan Rahid** — ID `2023100000546`.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Seeding the Database](#seeding-the-database)
- [Admin Panel](#admin-panel)
- [Live Chat Widget](#live-chat-widget)
- [Inventory & Stock Handling](#inventory--stock-handling)
- [API Reference](#api-reference)
- [Data Models](#data-models)
- [Deployment](#deployment)
- [Security Notes](#security-notes)
- [Scripts](#scripts)

---

## Features

### Storefront (customer)
- 🏺 **Product catalogue** with categories, badges (new / sale / hot), best-selling flags, ratings, and offers.
- 🔎 **Search** across product name, description, and category (Bengali + English).
- 🛒 **Cart** persisted in `localStorage`, with quantity controls.
- 💳 **Checkout** that creates an order and returns a unique tracking number (`MP-YYYYMMDD-XXXX`).
- 📦 **Order tracking** by order number.
- 👤 **Customer authentication** — register / login / account, with secure password hashing and an HMAC-signed session cookie.
- 💬 **Live-chat widget** — a configurable third-party chat script that loads on all customer pages.

### Admin panel
- 📊 **Dashboard** with store statistics.
- 🛍️ **Products CRUD** — create, edit, delete, with inventory (`stock`) management.
- 📥 **CSV import / export** for bulk product management.
- 📦 **Orders** — view and update order status (pending → processing → shipped → delivered → cancelled).
- 🧑‍🎨 **Artisans** management.
- ⚙️ **Settings** — configure the live-chat widget.

---

## Tech Stack

| Layer        | Technology                                          |
| ------------ | --------------------------------------------------- |
| Framework    | Next.js 16.2.6 (App Router, Turbopack)              |
| UI           | React 19, Tailwind CSS v4, lucide-react, framer-motion |
| Backend      | Next.js Route Handlers (serverless API routes)      |
| Database     | MongoDB Atlas via Mongoose 9                         |
| Auth         | Node `crypto` scrypt hashing + HMAC-signed cookies  |
| Language     | TypeScript 5                                         |

---

## Architecture

A standard three-tier architecture, all hosted within a single Next.js app:

```
┌─────────────────────┐     ┌──────────────────────────┐     ┌──────────────────┐
│      CLIENT          │     │        SERVER             │     │    DATABASE       │
│  (React components,  │ ──▶ │  Next.js Route Handlers   │ ──▶ │  MongoDB Atlas    │
│   App Router pages)  │ ◀── │  (/api/*), Mongoose models│ ◀── │  (matir-poshra)   │
└─────────────────────┘     └──────────────────────────┘     └──────────────────┘
```

- **Client** — App Router pages and client components handle rendering, cart state (Context + `localStorage`), and form submission.
- **Server** — Route handlers under `src/app/api/*` validate input, run business logic, and talk to MongoDB through Mongoose models. A globally-cached Mongoose connection (`src/lib/mongodb.ts`) keeps serverless cold-starts cheap.
- **Database** — MongoDB Atlas, database name `matir-poshra`, with collections for products, categories, artisans, orders, users, reviews, and a singleton settings document.

---

## Project Structure

```
src/
├── app/
│   ├── (storefront pages)        # home, login, register, account, search,
│   │                             # category/[slug], product/[id], checkout, offers
│   ├── mp-control-7h2x/          # admin panel (obscured route)
│   │   ├── login/                # admin login
│   │   ├── products/             # product CRUD + CSV
│   │   ├── orders/               # order management
│   │   ├── artisans/             # artisan management
│   │   └── settings/             # live-chat config
│   └── api/
│       ├── admin/                # admin-only endpoints (products, orders, artisans, settings)
│       ├── auth/                 # register, login, logout, me, profile
│       ├── orders/               # create + track orders (decrements stock)
│       ├── search/               # product search
│       └── settings/             # public live-chat config
├── components/                   # shared + admin UI components
├── context/                      # AuthContext, CartContext
├── lib/                          # mongodb, auth, settings, csv, productCsv helpers
├── models/                       # Mongoose schemas
└── data/                         # seedProducts.json
scripts/
└── seed.mjs                      # one-shot DB seeding script
```

---

## Getting Started

### Prerequisites
- Node.js 20+
- A MongoDB Atlas cluster (or any MongoDB connection string)

### Install & run

```bash
# 1. Install dependencies
npm install

# 2. Create your environment file (see below)
cp .env.example .env.local
# then edit .env.local with your own values

# 3. Seed the database with demo products (optional but recommended)
node scripts/seed.mjs

# 4. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

Create a `.env.local` file in the project root (it is gitignored and never committed):

```bash
# MongoDB connection string (Atlas or local). The database name "matir-poshra"
# is set in code (src/lib/mongodb.ts) — you do not need it in the URI.
MONGODB_URI="mongodb+srv://<user>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority"

# Secret used to sign HMAC session cookies. Use a long random string.
AUTH_SECRET="change-me-to-a-long-random-secret"
```

A template is provided in [`.env.example`](.env.example).

---

## Seeding the Database

```bash
node scripts/seed.mjs
```

This self-contained script reads `src/data/seedProducts.json` (28 products) and **wipes** the products, categories, and artisans collections before inserting fresh demo data. It reads `MONGODB_URI` from `.env.local`.

---

## Admin Panel

The admin panel lives at an obscured route so it isn't trivially discoverable:

| | |
| --- | --- |
| **URL**       | `/mp-control-7h2x/login` |
| **Username**  | `mpadmin` (fixed) |
| **Password**  | `Matir@Poshara2026` |

> ⚠️ Authentication here is **client-side only** (a `localStorage` flag) — it's adequate for a demo/course project but **not** production-grade. See [Security Notes](#security-notes).

From the panel you can manage products (incl. CSV import/export), orders, artisans, and the live-chat settings.

---

## Live Chat Widget

The live chat is a **third-party script widget** (not an iframe). When enabled, the configured script is injected on every customer-facing page and self-mounts its own floating button/panel; it is removed inside the admin panel.

Configure it under **Admin → Settings**:

- **Script URL** — e.g. `https://symai.aetherbd.com/static/widget.js`
- **Tenant ID** — your widget's `data-tenant-id`
- **Enable toggle** — the widget loads only when enabled *and* both fields are set.

Implementation: `src/components/LiveChatWidget.tsx` injects
`<script src="<scriptUrl>" defer data-tenant-id="<tenantId>">` into the page body.

---

## Inventory & Stock Handling

Each product has a `stock` count. Admins see the exact number; customers only see **in stock** vs **out of stock** (`stock > 0`).

When an order is placed via `POST /api/orders`, the server:

1. **Validates stock** for every line item. If any item's quantity exceeds available stock, the order is rejected with `409 Conflict` and a message indicating how many remain.
2. **Creates the order**.
3. **Decrements stock** for each product using an atomic `Product.bulkWrite` with `$inc: { stock: -qty }`, guarded by a `stock >= qty` filter to prevent overselling under concurrent requests.

This keeps the database the single source of truth — the admin counts and the customer-facing in/out-of-stock display update immediately.

---

## API Reference

### Public
| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| `POST` | `/api/auth/register` | Register a customer |
| `POST` | `/api/auth/login` | Log in (sets session cookie) |
| `POST` | `/api/auth/logout` | Log out |
| `GET`  | `/api/auth/me` | Current session user |
| `PATCH`| `/api/auth/profile` | Update profile |
| `GET`  | `/api/search?q=...` | Search products |
| `POST` | `/api/orders` | Place an order (validates + decrements stock) |
| `GET`  | `/api/orders?orderNumber=...` | Track an order |
| `GET`  | `/api/settings` | Public live-chat config |

### Admin
| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| `GET / POST` | `/api/admin/products` | List / create products |
| `PATCH / DELETE` | `/api/admin/products/[id]` | Update / delete a product |
| `POST` | `/api/admin/products/import` | Bulk CSV import |
| `GET`  | `/api/admin/products/export` | CSV export |
| `GET`  | `/api/admin/orders` | List orders |
| `PATCH`| `/api/admin/orders/[id]` | Update order status |
| `GET / POST` | `/api/admin/artisans` | Manage artisans |
| `GET / PATCH` | `/api/admin/settings` | Read / update settings |

---

## Data Models

- **Product** — `name, description, price, originalPrice, rating, reviewsCount, category, badge, image, images, icon, stock, isBestSelling`
- **Order** — `orderNumber, customer{name,phone,address}, items[{productId,name,price,qty,icon}], totalPrice, status`
- **User** — customer account (scrypt-hashed password)
- **Artisan**, **Category**, **Review**
- **Settings** — singleton (`key: "global"`): `liveChatEnabled, liveChatScriptUrl, liveChatTenantId`

---

## Deployment

The app deploys to any Node/serverless host that supports Next.js (Vercel, Netlify, etc.):

1. Set `MONGODB_URI` and `AUTH_SECRET` as environment variables on the host.
2. In MongoDB Atlas → **Network Access**, allow your host's egress IPs (or `0.0.0.0/0` for serverless platforms with dynamic IPs).
3. Build & start:
   ```bash
   npm run build
   npm run start
   ```

> Note: MongoDB **Change Streams** do not work on most serverless platforms — this app does not rely on them.

---

## Security Notes

This is a course/demo project. Before any real-world use:

- 🔐 **Admin auth is client-side only** (`localStorage`), so `/api/admin/*` endpoints are **not** protected server-side. Add server-side auth (e.g., NextAuth or signed admin cookies + middleware) before deploying publicly.
- 🔑 **Rotate any credentials** that were shared during development (DB password, `AUTH_SECRET`).
- 🙈 Keep `.env.local` out of version control (it already is, via `.gitignore`).

---

## Scripts

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Start the dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `node scripts/seed.mjs` | Seed the database with demo data |
