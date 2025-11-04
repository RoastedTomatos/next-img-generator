# Project Architecture

## Overview

The AI Image Generator Gallery is built using Next.js 14 with the App Router, following modern React patterns and best practices. The application uses Supabase for data persistence and ShadCN UI for component styling.

## Technology Stack

### Core Framework
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **React 18** - UI library

### Styling & UI
- **Tailwind CSS** - Utility-first CSS framework
- **ShadCN UI** - Component library built on Radix UI
- **CSS Variables** - For theming support

### Backend & Database
- **Supabase** - Backend-as-a-Service (PostgreSQL database)
- **Supabase Client** - JavaScript client for database operations

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **TypeScript** - Static type checking

## Project Structure

```
next-img-generator/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── generate/             # Image generation endpoint
│   │   │   └── route.ts
│   │   └── images/               # Image fetching endpoint
│   │       └── route.ts
│   ├── gallery/
│   │   ├── page.tsx              # Gallery page with generated images 
│   ├── layout.tsx                # Root layout component
│   ├── page.tsx                  # Home page
│   ├── error.tsx                 # Error boundary
│   ├── not-found.tsx             # 404 page
│   ├── loading.tsx               # Loading state
│   └── globals.css               # Global styles
│
├── components/                   # React components
│   ├── ui/                       # ShadCN UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── input.tsx
│   ├── image-generator.tsx       # Image generation form
│   └── gallery.tsx               # Image gallery display
│
├── lib/                          # Utility libraries
│   ├── supabase/                 # Supabase clients
│   │   ├── client.ts             # Client-side Supabase client
│   │   └── server.ts             # Server-side Supabase client
│   ├── types.ts                  # TypeScript type definitions
│   └── utils.ts                  # Utility functions (cn helper)
│
├── supabase/                     # Database migrations
│   └── migrations/
│       └── 001_create_generated_images_table.sql
│
├── doc/                          # Documentation
│
└── Configuration files
    ├── package.json
    ├── tsconfig.json
    ├── tailwind.config.ts
    ├── next.config.js
    ├── postcss.config.js
    ├── components.json           # ShadCN configuration
    └── .eslintrc.json
```

## Architecture Patterns

### 1. App Router Pattern
- Uses Next.js 14 App Router for file-based routing
- Server and Client Components are separated
- API routes are co-located in the `app/api` directory

### 2. Component Architecture
- **UI Components** (`components/ui/`) - Reusable, styled components from ShadCN
- **Feature Components** (`components/`) - Business logic components
- Client Components marked with `'use client'` directive
- Server Components by default

### 3. Data Flow

```
User Input (Client Component)
    ↓
API Route (Server)
    ↓
Supabase Client
    ↓
PostgreSQL Database
    ↓
Response back to Client
```

### 4. Error Handling
- **Error Boundaries** - `app/error.tsx` for catching React errors
- **API Error Handling** - Try-catch blocks in API routes with proper HTTP status codes
- **Client Error Handling** - Error states in components with user-friendly messages

### 5. Type Safety
- TypeScript throughout the codebase
- Shared types in `lib/types.ts`
- Type-safe API responses

## Database Schema

### `generated_images` Table

```sql
- id (UUID, Primary Key)
- prompt (TEXT, Required)
- image_url (TEXT, Required)
- width (INTEGER, Default: 1024)
- height (INTEGER, Default: 1024)
- user_id (UUID, Optional - for future auth)
- created_at (TIMESTAMP, Auto-generated)
```

**Indexes:**
- `idx_generated_images_created_at` - For efficient sorting by date
- `idx_generated_images_user_id` - For future user-specific queries

**Security:**
- Row Level Security (RLS) enabled
- Currently allows all operations (update when auth is added)

## API Architecture

### RESTful Endpoints

#### POST `/api/generate`
- Generates an AI image based on a prompt
- Saves to database
- Returns generated image data

#### GET `/api/images`
- Fetches all generated images
- Supports pagination (limit, offset query params)
- Returns array of images

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL       # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY  # Supabase anonymous key
HF_TOKEN                       # HuggingFace Inference API key
```

## Security Considerations

1. **API Routes** - Server-side validation of inputs
2. **Environment Variables** - Sensitive data stored in `.env.local`
3. **Database** - Row Level Security enabled
4. **Error Messages** - No sensitive information exposed to clients

## Deployment Considerations

- **Vercel** - Recommended deployment platform (Next.js optimized)
- **Environment Variables** - Must be configured in deployment platform
- **Database** - Supabase connection string must be accessible
- **Image Domains** - Configured in `next.config.js` for Next.js Image optimization

