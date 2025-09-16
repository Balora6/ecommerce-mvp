# DTC Ecommerce Brokerage MVP

A small but real slice of MVP that proves integration with Shopify, secure data persistence, clean API for metrics, and production standards.

## Frontend vs Backend Separation

### Frontend (Client-side)

- **Location**: `src/app/` (pages), `src/components/`
- **Purpose**: User interface, OAuth flow initiation, metrics display
- **Technologies**: React, Next.js App Router, Tailwind CSS
- **Key Components**:
  - Connect Shopify button
  - Metrics display table
  - Error boundaries

### Backend (Server-side)

- **Location**: `src/app/api/` (API routes), `src/lib/` (utilities)
- **Purpose**: API endpoints, data processing, external integrations
- **Technologies**: Next.js API routes, Supabase, Shopify Admin API
- **Key Features**:
  - Shopify OAuth callback handling
  - Metrics aggregation from Shopify
  - Database operations
  - Security utilities

### Shared Code

- **Location**: `src/lib/`, `src/types/`, `src/utils/`
- **Purpose**: Business logic, type definitions, utilities used by both frontend and backend

## Setup Instructions

1. **Clone the repository**
2. **Install dependencies**: `npm install`
3. **Create environment file**:
   ```bash
   cp env.example .env
   ```
4. **Fill in your environment variables** (see Environment Variables section below)
5. **Set up Supabase database**: `npm run db:push`
6. **Run development server**: `npm run dev`

## Environment Variables

### Required Variables:

1. **Supabase**:

   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` - Optional (will fallback to anon key if not defined)

2. **Shopify**:

   - `SHOPIFY_APP_KEY`
   - `SHOPIFY_APP_SECRET`
   - `SHOPIFY_SCOPES` - Already set to required scopes

3. **Database**:
   - `DATABASE_URL` - Get from Supabase

### Quick Start:

```bash
# Copy the example file
cp env.example .env

# Edit .env with your values
```

## API Endpoints

- `GET /api/auth/shopify/callback` - Shopify OAuth callback
- `GET /api/shops/[id]/metrics` - Get shop metrics for last 30 days

## Testing

Run tests: `npm test`

## Decisions Made

- Using Next.js App Router for modern React patterns
- Prisma for database schema management
- Supabase for PostgreSQL, auth, and real-time features
- Jest for testing with React Testing Library
- Tailwind CSS for minimal styling (function over form)
- Dubai timezone (UTC+4) for date calculations

## Production Hardening

For production deployment:

- Implement proper error logging and monitoring
- Add rate limiting and request validation
- Use environment-specific configurations
- Implement proper secret rotation
- Add comprehensive audit logging
- Set up automated backups and disaster recovery
- Implement proper CORS and security headers
- Add API versioning and deprecation strategies
