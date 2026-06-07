# ⚡ TechStore — E-Commerce Frontend Architecture
> React 19 · Vite · Shadcn/ui · Tailwind · Redux Toolkit · React Router v7 · REST API

---

## 1. Project Overview

| Attribute         | Decision                          | Rationale |
|-------------------|-----------------------------------|-----------|
| Framework         | React 19                          | Latest concurrent features, `use()` hook, server actions ready |
| Build Tool        | Vite 5                            | Fastest HMR for solo dev, native ESM |
| Language          | JavaScript (JSX)                  | Faster iteration for solo developer |
| Styling           | Tailwind CSS v4 + Shadcn/ui       | Utility-first + pre-built accessible components |
| Routing           | React Router v7                   | File-system-like nested layouts, loaders, actions |
| State Management  | Redux Toolkit (RTK)               | Structured slices: cart, auth, ui, wishlist |
| Server State      | RTK Query                         | Built into RTK — handles REST API caching, loading, errors |
| Domain            | Electronics / Tech Store          | Product catalog, specs, comparisons, cart, checkout |

---

## 2. Folder Structure

```
techstore/
├── public/
│   └── assets/                   # Static assets (logo, og-image)
│
├── src/
│   ├── app/                      # Redux store + RTK Query base
│   │   ├── store.js
│   │   └── api/
│   │       └── baseApi.js        # RTK Query createApi (base URL)
│   │
│   ├── components/               # Shared / reusable UI
│   │   ├── ui/                   # Shadcn/ui generated components
│   │   ├── layout/
│   │   │   ├── RootLayout.jsx    # Header + Footer + Outlet
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── product/
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProductGrid.jsx
│   │   │   └── ProductBadge.jsx
│   │   └── common/
│   │       ├── Spinner.jsx
│   │       ├── ErrorBoundary.jsx
│   │       └── EmptyState.jsx
│   │
│   ├── features/                 # Redux slices + RTK Query endpoints
│   │   ├── auth/
│   │   │   ├── authSlice.js
│   │   │   └── authApi.js
│   │   ├── cart/
│   │   │   ├── cartSlice.js
│   │   │   └── CartDrawer.jsx
│   │   ├── products/
│   │   │   ├── productsApi.js    # RTK Query endpoints
│   │   │   └── productsSlice.js  # filters, sort state
│   │   ├── wishlist/
│   │   │   └── wishlistSlice.js
│   │   └── ui/
│   │       └── uiSlice.js        # modal, sidebar, theme toggle
│   │
│   ├── pages/                    # Route-level page components
│   │   ├── Home/
│   │   │   └── index.jsx
│   │   ├── Catalog/
│   │   │   └── index.jsx
│   │   ├── ProductDetail/
│   │   │   └── index.jsx
│   │   ├── Cart/
│   │   │   └── index.jsx
│   │   ├── Checkout/
│   │   │   └── index.jsx
│   │   ├── Account/
│   │   │   └── index.jsx
│   │   ├── Auth/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   └── NotFound/
│   │       └── index.jsx
│   │
│   ├── routes/
│   │   └── router.jsx            # createBrowserRouter definition
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── useCart.js
│   │   ├── useAuth.js
│   │   └── useDebounce.js
│   │
│   ├── utils/                    # Pure utility functions
│   │   ├── formatCurrency.js
│   │   ├── slugify.js
│   │   └── validators.js
│   │
│   ├── constants/
│   │   ├── routes.js             # Route path constants
│   │   └── categories.js        # Tech product categories
│   │
│   ├── styles/
│   │   └── globals.css           # Tailwind directives + CSS vars
│   │
│   ├── main.jsx                  # ReactDOM.createRoot entry
│   └── App.jsx                   # RouterProvider wrapper
│
├── .env.example
├── index.html
├── vite.config.js
├── tailwind.config.js
├── components.json               # Shadcn config
├── jsconfig.json                 # Path aliases
└── package.json
```

---

## 3. Core Dependencies

```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^7.0.0",
    "@reduxjs/toolkit": "^2.3.0",
    "react-redux": "^9.1.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.3.0",
    "lucide-react": "^0.400.0",
    "sonner": "^1.5.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.0",
    "vite": "^5.3.0",
    "tailwindcss": "^4.0.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

---

## 4. Routing Architecture (React Router v7)

```
/                          → Home (Hero + Featured + Categories)
/catalog                   → Catalog (Grid + Filters sidebar)
/catalog/:categorySlug     → Filtered Catalog
/products/:productId       → Product Detail
/cart                      → Cart Page
/checkout                  → Checkout (Protected)
/account                   → Account Dashboard (Protected)
/auth/login                → Login
/auth/register             → Register
*                          → 404 Not Found
```

**Protected Routes** wrap children in an `<AuthGuard>` component that reads from `authSlice`.

---

## 5. Redux Store Shape

```js
{
  auth: {
    user: null | { id, name, email, avatar },
    token: null | String,
    status: "idle" | "loading" | "succeeded" | "failed"
  },
  cart: {
    items: [{ productId, name, price, qty, image }],
    coupon: null,
    status: "idle" | "syncing"
  },
  wishlist: {
    items: [productId]
  },
  ui: {
    cartDrawerOpen: false,
    mobileMenuOpen: false,
    theme: "dark" | "light"
  },
  // RTK Query auto-managed:
  productsApi: { queries, mutations, subscriptions }
}
```

---

## 6. RTK Query API Endpoints (planned)

| Endpoint                  | Method | Description                  |
|---------------------------|--------|------------------------------|
| `/products`               | GET    | Paginated product list       |
| `/products/:id`           | GET    | Single product detail        |
| `/products/featured`      | GET    | Homepage featured items      |
| `/categories`             | GET    | All tech categories          |
| `/cart`                   | GET    | Server-side cart sync        |
| `/cart/items`             | POST   | Add item                     |
| `/cart/items/:id`         | PATCH  | Update qty                   |
| `/cart/items/:id`         | DELETE | Remove item                  |
| `/auth/login`             | POST   | Login → returns JWT          |
| `/auth/register`          | POST   | Register new user            |
| `/orders`                 | POST   | Create order (checkout)      |
| `/orders/:id`             | GET    | Order detail                 |

---

## 7. Environment Variables

```bash
# .env.example
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_APP_NAME=TechStore
VITE_STRIPE_PUBLIC_KEY=pk_test_xxxx
```

---

## 8. Setup Commands (Step-by-Step)

```bash
# 1. Scaffold project
npm create vite@latest techstore -- --template react
cd techstore

# 2. Install core dependencies
npm install react-router-dom @reduxjs/toolkit react-redux
npm install lucide-react clsx tailwind-merge class-variance-authority sonner

# 3. Install Tailwind CSS v4
npm install -D tailwindcss@next @tailwindcss/vite

# 4. Initialize Shadcn/ui
npx shadcn@latest init

# 5. Add first Shadcn components
npx shadcn@latest add button badge card input sheet drawer

# 6. Setup path aliases in vite.config.js
# Add: resolve: { alias: { '@': path.resolve(__dirname, './src') } }

# 7. Start dev server
npm run dev
```

---

## 9. Layout Zones

```
┌─────────────────────────────────────────────┐
│                  HEADER                      │  ← sticky, 64px
│  Logo   Nav Categories   Search   Cart Auth  │
├─────────────────────────────────────────────┤
│                  HERO / PAGE CONTENT         │  ← route Outlet
│                                             │
│  [Sidebar]  │  [Main Grid / Detail]          │  ← catalog pages
│             │                               │
├─────────────────────────────────────────────┤
│                  FOOTER                      │  ← links, newsletter
└─────────────────────────────────────────────┘
       ↕ CartDrawer slides from right (Sheet)
```

---

## 10. Development Phases

| Phase | Scope                                      | Status   |
|-------|--------------------------------------------|----------|
| 1     | Project setup, layout, routing skeleton    | 🔄 Now   |
| 2     | Product catalog, RTK Query, filters        | Planned  |
| 3     | Product detail, image gallery, specs table | Planned  |
| 4     | Cart (drawer + page), Redux cart slice     | Planned  |
| 5     | Auth (login/register), protected routes    | Planned  |
| 6     | Checkout flow, order confirmation          | Planned  |
| 7     | Account dashboard, order history           | Planned  |
| 8     | Performance, SEO, deployment               | Planned  |
