# Project Structure Guide

This document outlines the organization of the project and explains the purpose of each directory.

## Directory Structure

```
project-root/
├── public/                               # Static files served at /
│   ├── images/
│   ├── favicon.ico
│   └── robots.txt
│
├── src/
│   ├── app/                              # App Router (file-based routing)
│   │   ├── (auth)/                       # Auth group layout - login & register pages
│   │   │   ├── login/                    # Login page
│   │   │   ├── register/                 # Registration page
│   │   │   └── layout.tsx                # Auth layout wrapper
│   │   │
│   │   ├── (main)/                       # Main app group layout - authenticated pages
│   │   │   ├── page.tsx                  # Home/dashboard page
│   │   │   ├── profile/                  # User profile page
│   │   │   └── layout.tsx                # Main layout wrapper
│   │   │
│   │   ├── orders/                       # Orders pages
│   │   │   ├── page.tsx                  # Orders list
│   │   │   └── [id]/                     # Dynamic order details page
│   │   │       └── page.tsx
│   │   │
│   │   ├── chats/                        # Chat pages
│   │   │   └── [id]/                     # Dynamic chat page by chat ID
│   │   │       └── page.tsx
│   │   │
│   │   ├── api/                          # API Route Handlers (server endpoints)
│   │   │   ├── auth/                     # Authentication endpoints
│   │   │   │   └── route.ts
│   │   │   └── orders/                   # Orders endpoints
│   │   │       └── route.ts
│   │   │
│   │   ├── layout.tsx                    # Root layout wrapper
│   │   ├── loading.tsx                   # Global loading UI (Suspense fallback)
│   │   ├── error.tsx                     # Global error boundary UI
│   │   └── not-found.tsx                 # 404 error page
│   │
│   ├── features/                         # Business logic modules (feature-based organization)
│   │   │                                 # Each feature is self-contained with its own logic
│   │   │
│   │   ├── auth/                         # Authentication feature
│   │   │   ├── components/               # UI components for auth flows
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── RegisterForm.tsx
│   │   │   │   └── index.ts
│   │   │   ├── hooks/                    # Custom hooks (useLogin, useRegister)
│   │   │   │   ├── useLogin.ts
│   │   │   │   ├── useRegister.ts
│   │   │   │   └── index.ts
│   │   │   ├── services/                 # API service calls
│   │   │   │   ├── auth.service.ts       # Auth API functions
│   │   │   │   └── index.ts
│   │   │   ├── actions/                  # Next.js Server Actions
│   │   │   │   ├── auth.action.ts
│   │   │   │   └── index.ts
│   │   │   ├── utils/                    # Utility functions (validation, formatting)
│   │   │   │   ├── authValidator.ts
│   │   │   │   └── index.ts
│   │   │   ├── @types/                   # TypeScript interfaces for auth
│   │   │   │   ├── auth.types.ts         # Core auth types (User, Session)
│   │   │   │   ├── auth.dto.ts           # Data transfer objects (requests/responses)
│   │   │   │   ├── auth.response.ts      # API response types
│   │   │   │   └── index.ts
│   │   │   └── index.ts                  # Barrel export
│   │   │
│   │   ├── chat/                         # Chat/Messaging feature
│   │   │   ├── components/               # Chat UI components (ChatBubble, ChatInput)
│   │   │   ├── hooks/                    # Custom hooks (useChat)
│   │   │   ├── services/                 # Chat API service calls
│   │   │   ├── @types/                   # Chat types (Message, Chat)
│   │   │   └── index.ts
│   │   │
│   │   ├── orders/                       # Orders management feature
│   │   │   ├── components/               # Order UI components (OrderCard, OrderStatusBadge)
│   │   │   ├── hooks/                    # Custom hooks (useOrders)
│   │   │   ├── services/                 # Orders API service calls
│   │   │   ├── actions/                  # Server actions for order operations
│   │   │   ├── @types/                   # Order types & statuses
│   │   │   └── index.ts
│   │   │
│   │   └── home/                         # Home/Dashboard feature
│   │       ├── components/               # Home page components
│   │       ├── hooks/                    # Custom hooks (useHome)
│   │       ├── services/                 # Home data fetching services
│   │       ├── @types/                   # Home feature types
│   │       └── index.ts
│   │
│   ├── global/                           # Shared app infrastructure & utilities
│   │   │                                 # Used across all features
│   │   │
│   │   ├── components/                   # Reusable UI components
│   │   │   ├── ui/                       # Primitive UI components
│   │   │   │   ├── Button.tsx            # Button component
│   │   │   │   ├── Input.tsx             # Text input component
│   │   │   │   ├── Card.tsx              # Card component
│   │   │   │   └── index.ts
│   │   │   ├── shared/                   # App layout components
│   │   │   │   ├── AppHeader.tsx         # App header/navbar
│   │   │   │   ├── Footer.tsx            # App footer
│   │   │   │   ├── Loader.tsx            # Loading spinner
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── hooks/                        # Global reusable hooks
│   │   │   ├── useTheme.ts               # Theme management hook
│   │   │   ├── useDebounce.ts            # Debounce hook
│   │   │   └── index.ts
│   │   │
│   │   ├── utils/                        # Utility functions
│   │   │   ├── formatDate.ts             # Date formatting
│   │   │   ├── validateEmail.ts          # Email validation
│   │   │   ├── cn.ts                     # className utility (clsx/classnames)
│   │   │   └── index.ts
│   │   │
│   │   ├── constants/                    # App-wide constants
│   │   │   ├── colors.ts                 # Color palette
│   │   │   ├── strings.ts                # UI strings/messages
│   │   │   ├── endpoints.ts              # API endpoints
│   │   │   └── index.ts
│   │   │
│   │   ├── store/                        # Global state management
│   │   │   ├── auth.store.ts             # Auth state (Zustand/Redux)
│   │   │   ├── theme.store.ts            # Theme state
│   │   │   └── index.ts
│   │   │
│   │   ├── lib/                          # Third-party library clients
│   │   │   ├── prisma.ts                 # Prisma database client
│   │   │   ├── supabase.ts               # Supabase client
│   │   │   ├── analytics.ts              # Analytics service
│   │   │   └── index.ts
│   │   │
│   │   ├── config/                       # Application configuration
│   │   │   ├── site.ts                   # Site metadata & config
│   │   │   ├── env.ts                    # Environment variables
│   │   │   ├── apiClient.ts              # API client setup
│   │   │   └── index.ts
│   │   │
│   │   ├── @types/                       # Global TypeScript types
│   │   │   ├── api.types.ts              # API-related types
│   │   │   ├── common.types.ts           # Common shared types
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts                      # Barrel export
│   │
│   └── styles/                           # Global styles
│       └── globals.css                   # Global CSS
│
├── tsconfig.json                         # TypeScript configuration
├── package.json                          # Dependencies & scripts
├── next.config.ts                        # Next.js configuration
├── tailwind.config.ts                    # Tailwind CSS configuration
└── .env.local                            # Local environment variables
```

## Key Concepts

### 1. **App Router (`/app`)**

- File-based routing using Next.js App Router
- Page components organized by route structure
- Route groups `(auth)` and `(main)` organize related pages
- Dynamic routes use `[id]` convention

### 2. **Features (`/features`)**

- Self-contained business logic modules
- Each feature has its own:
  - **components**: UI elements specific to the feature
  - **hooks**: Custom React hooks for state/logic
  - **services**: API calls and data fetching
  - **actions**: Next.js Server Actions
  - **utils**: Feature-specific utilities
  - **@types**: TypeScript interfaces and DTOs
- **Barrel exports** (`index.ts`) for clean imports

### 3. **Global (`/global`)**

- Shared infrastructure used across all features
- **components/ui**: Reusable UI primitives (Button, Input, Card)
- **components/shared**: App layout components (Header, Footer)
- **hooks**: Common hooks (theme, debounce, async)
- **utils**: Helper functions (date formatting, validation)
- **constants**: Hardcoded values (colors, endpoints)
- **store**: Global state management
- **lib**: Third-party clients (Prisma, Supabase)
- **config**: App configuration and environment

### 4. **Naming Conventions**

- Components: PascalCase (e.g., `LoginForm.tsx`)
- Hooks: camelCase with `use` prefix (e.g., `useLogin.ts`)
- Services: `featureName.service.ts`
- Actions: `featureName.action.ts`
- Types: `featureName.types.ts`
- Utils: descriptive names (e.g., `formatDate.ts`)

### 5. **Import Patterns**

```typescript
// Feature components
import { LoginForm } from "@/features/auth/components";

// Global utilities
import { cn } from "@/global/utils";
import { Button } from "@/global/components";

// Types
import type { AuthResponse } from "@/features/auth/@types";
```

## Best Practices

1. **Keep features self-contained** - All logic for a feature should live in its folder
2. **Use barrel exports** - Simplify imports with `index.ts` files
3. **Type everything** - Use TypeScript for better DX and fewer bugs
4. **Separate concerns** - Keep components, logic, and services separate
5. **Reuse globals** - Use global utilities, components, and hooks to avoid duplication
6. **Server Actions** - Use Server Actions in `/actions` for mutations
7. **API Routes** - Use `/app/api` routes for API endpoints

## Adding a New Feature

1. Create a new folder in `/src/features/yourFeature`
2. Create subdirectories: `components`, `hooks`, `services`, `@types`
3. Create `index.ts` barrel export
4. Add feature pages in `/src/app` as needed
5. Export and use throughout the app

## Environment Setup

Update `.env.local` with your configuration:

```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
DATABASE_URL=your_database_url
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```
