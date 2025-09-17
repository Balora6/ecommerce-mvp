# Shopify OAuth Integration MVP

A minimal Next.js application that demonstrates Shopify OAuth integration with Supabase PostgreSQL backend.

# Setup Instructions

## Install dependencies

```bash
npm install
```

### 2. Environment Variables Setup

```bash
cp env.example .env
```

Fill `.env.local` with the following values:

#### Database (Supabase PostgreSQL)

```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
```

**How to get DATABASE_URL:**

1. Go to [supabase.com](https://supabase.com)
2. Create a new project or use an existing one
3. Go to Settings → Database
4. Copy the Connection string (URI)

#### Supabase Configuration

```env
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"
SUPABASE_SERVICE_ROLE_KEY="[YOUR-SERVICE-ROLE-KEY]"
```

**How to get Supabase keys:**

1. In your Supabase project, go to Settings → API
2. Copy Project URL for `NEXT_PUBLIC_SUPABASE_URL`
3. Copy anon public key for `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Copy service_role key for `SUPABASE_SERVICE_ROLE_KEY`

#### Shopify App Configuration

```env
SHOPIFY_CLIENT_ID="[YOUR-SHOPIFY-CLIENT-ID]"
SHOPIFY_CLIENT_SECRET="[YOUR-SHOPIFY-CLIENT-SECRET]"
NEXT_PUBLIC_SHOPIFY_SHOP_DOMAIN="[YOUR-SHOPIFY-STORE_DOMAIN]"
```

**How to get Shopify keys:**

1. Go to [partners.shopify.com](https://partners.shopify.com)
2. Sign in or create a Partner account
3. Create a new app in Partner Dashboard
4. In App setup, specify:
   - App URL: `http://localhost:3000` (for development)
   - Allowed redirection URL(s): `http://localhost:3000/api/auth/shopify/callback`
5. Copy Client ID and Client Secret

### 3. Database Setup

# Generate Prisma client

```bash
npm run db:generate
```

# Apply database migrations

```bash
npm run db:push
```

### 4. Run the Application

```bash
npm run dev
```

### 5. Run the Tests

```bash
npm run test
```
