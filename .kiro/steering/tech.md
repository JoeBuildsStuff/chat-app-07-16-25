# Technology Stack

## Framework & Runtime
- **Next.js 15.4.1** with App Router
- **React 19.1.0** with TypeScript
- **Node.js** runtime

## Backend & Database
- **Supabase** for authentication, database, and real-time features
- **Server Actions** for backend logic
- **Supabase SSR** for server-side rendering support

## UI & Styling
- **Tailwind CSS v4** for styling
- **shadcn/ui** ALWAYS USE SHADCN/UI COMPONENTS FROM `@/components/ui`
- **Radix UI** primitives for accessible components
- **Lucide React** for icons
- **next-themes** for dark/light mode

### Component Usage Rules
- **ALWAYS** use existing shadcn/ui components from `@/components/ui` directory
- **NEVER** create custom unstyled components with raw Tailwind classes when shadcn/ui equivalents exist
- Use `Button`, `Input`, `Card`, `Dialog`, `Select`, etc. from `@/components/ui`
- Only use raw Tailwind for layout and spacing, not for component styling
- If a shadcn/ui component doesn't exist, add it using `pnpm dlx shadcn@latest add <component>`

## State Management & Data
- **Zustand** for client-side state management
- **TanStack Table** for advanced data tables
- **React Hook Form** with Zod validation
- **TipTap** for rich text editing

## AI & Chat
- **Anthropic SDK** for AI conversations
- Custom chat store with session management

## Package Manager
- **pnpm** (version 9.15.4+)

## Common Commands

```bash
# Development
pnpm dev          # Start development server on localhost:3000
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint

# Package management
pnpm install      # Install dependencies
pnpm add <pkg>    # Add new dependency
```

## Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- Additional Supabase and Anthropic keys in `.env.local`