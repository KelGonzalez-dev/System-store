# HotelSaaS Frontend

Enterprise hotel management dashboard built with React 18, TypeScript, Vite, Tailwind CSS, and shadcn/ui.

## Stack

- React 18 + TypeScript + Vite
- Tailwind CSS v4 + shadcn/ui
- React Router DOM v6
- TanStack React Query
- Axios (JWT interceptors + refresh token)
- Zustand (auth + UI state)
- React Hook Form + Zod
- Framer Motion + Recharts + Sonner

## Quick start

```bash
# Install dependencies
npm install

# Copy environment
cp .env.example .env

# Start dev server (http://localhost:5173)
npm run dev
```

Ensure the backend API is running at `http://localhost:5093`.

## Default credentials

- Email: `admin@hotelsaas.com`
- Password: `Admin@123456`

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |

## API

Base URL: `http://localhost:5093/api` (configurable via `VITE_API_URL`)

Vite proxies `/api` and `/uploads` to the backend during development.

## Project structure

```
src/
├── api/           # Axios instance, interceptors, endpoints
├── app/           # Providers, layouts
├── components/    # UI, tables, forms, dashboard, feedback
├── constants/
├── hooks/
├── lib/
├── pages/         # Route pages
├── routes/        # Router + protected routes
├── services/      # API services
├── store/         # Zustand stores
├── styles/
├── types/
└── utils/
```
