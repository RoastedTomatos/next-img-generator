# AI Image Generator Gallery

A Next.js 14 application for generating and browsing AI-generated images, built with Supabase, Tailwind CSS, and ShadCN UI.

## Features

- 🎨 AI image generation with customizable prompts
- 🖼️ Gallery view of generated images
- 🗄️ Supabase integration for data persistence
- 🎨 Modern UI with Tailwind CSS and ShadCN components
- ⚡ Built with Next.js 14 App Router
- 🛡️ Error handling and validation

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **UI Components:** ShadCN UI
- **Database:** Supabase
- **Language:** TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- A Supabase account and project

### Installation

1. Clone the repository and install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Set up environment variables:

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

Update `.env.local` with your Supabase project URL and anon key.

3. Set up Supabase database:

Create a table in your Supabase project:

```sql
CREATE TABLE generated_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  prompt TEXT NOT NULL,
  image_url TEXT NOT NULL,
  width INTEGER DEFAULT 1024,
  height INTEGER DEFAULT 1024,
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── generate/     # API route for image generation
│   │   └── images/       # API route for fetching images
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   ├── error.tsx         # Error boundary
│   ├── not-found.tsx     # 404 page
│   └── globals.css       # Global styles
├── components/
│   ├── ui/               # ShadCN UI components
│   ├── image-generator.tsx
│   └── gallery.tsx
├── lib/
│   ├── supabase/         # Supabase client configuration
│   ├── types.ts          # TypeScript types
│   └── utils.ts          # Utility functions
└── ...
```

## Next Steps

1. **Integrate AI Image Generation API:**
   - Update `app/api/generate/route.ts` to integrate with your preferred AI service (OpenAI DALL-E, Stability AI, etc.)
   - Add your API key to environment variables

2. **Add Authentication:**
   - Implement user authentication with Supabase Auth
   - Add user-specific image filtering

3. **Enhance Features:**
   - Add image download functionality
   - Implement pagination for the gallery
   - Add image editing/regeneration
   - Add image sharing capabilities

## Deployment

This project is ready to deploy on Vercel:

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## License

MIT

