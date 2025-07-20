# Project Structure

## Root Directory
- `.env.local` - Environment variables
- `components.json` - shadcn/ui configuration
- `next.config.ts` - Next.js configuration
- `tsconfig.json` - TypeScript configuration with `@/*` path mapping

## Source Organization (`src/`)

### App Router (`src/app/`)
- **Route Groups**: `(auth)` and `(app)` for layout separation
- **Auth Routes**: `/signin`, `/signup`, `/verify-email`, `/update-password`
- **App Routes**: `/workspace` with nested `/company` and `/person` pages
- **API Routes**: `/api/chat` for AI conversation endpoints

### Components (`src/components/`)
- **UI Components**: `ui/` - shadcn/ui components
- **Chat System**: `chat/` - Complete chat interface with providers
- **Data Tables**: `data-table/` - Reusable table components with CRUD operations
- **App Components**: Sidebar, auth, theme, and rich text editor components

### Library Code (`src/lib/`)
- **Supabase**: `supabase/` - Client, server, and middleware setup
- **Chat**: `chat/` - Zustand store and constants
- **Utils**: Common utilities and data table helpers

### Hooks (`src/hooks/`)
- Custom React hooks for user data, chat functionality, and responsive design

### Types (`src/types/`)
- TypeScript type definitions, primarily for chat functionality

## Architectural Patterns

### Route Organization
- Route groups for auth vs app layouts
- Co-located components in `_components/` folders
- Business logic in `_lib/` folders (actions, queries, validations)

### Component Structure
- Feature-based organization (chat, data-table)
- Separation of UI primitives and composed components
- Provider pattern for global state management

### Data Flow
- Server Actions for mutations
- Supabase queries for data fetching
- Zustand for client-side state
- React Hook Form + Zod for form handling

### Naming Conventions
- kebab-case for files and folders
- PascalCase for React components
- Descriptive, feature-based naming