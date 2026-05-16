# Folder structure

Full reference. For the high-level idea see [`architecture.md`](architecture.md).

```
.
├── .husky/                 Git hooks (pre-commit, commit-msg, pre-push)
├── docs/                   Documentation
├── public/                 Static assets (favicons, og.png, svgs)
├── src/
│   ├── app/                Next.js App Router
│   │   ├── (auth)/         Route group for unauthenticated screens
│   │   │   ├── layout.tsx
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── dashboard/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── profile/page.tsx
│   │   │   ├── projects/page.tsx
│   │   │   └── settings/page.tsx
│   │   ├── error.tsx
│   │   ├── layout.tsx
│   │   ├── loading.tsx
│   │   ├── not-found.tsx
│   │   ├── page.tsx
│   │   ├── robots.ts
│   │   └── sitemap.ts
│   ├── features/
│   │   ├── auth/
│   │   │   ├── @types/{auth.types,auth.dto,auth.response,index}.ts
│   │   │   ├── actions/auth.action.ts
│   │   │   ├── components/{LoginForm,RegisterForm,index}.tsx
│   │   │   ├── hooks/{useLogin,useRegister,index}.ts
│   │   │   ├── services/{auth.service,index}.ts
│   │   │   ├── utils/authValidator.ts
│   │   │   └── index.ts
│   │   ├── dashboard/
│   │   │   ├── @types/dashboard.types.ts
│   │   │   ├── components/DashboardOverview.tsx
│   │   │   ├── hooks/useDashboard.ts
│   │   │   ├── services/dashboard.service.ts
│   │   │   └── index.ts
│   │   ├── profile/
│   │   │   ├── @types/profile.types.ts
│   │   │   ├── components/ProfileForm.tsx
│   │   │   ├── utils/profileValidator.ts
│   │   │   └── index.ts
│   │   ├── projects/
│   │   │   ├── @types/projects.types.ts
│   │   │   ├── components/{ProjectCard,ProjectsTable,index}.tsx
│   │   │   ├── hooks/{useProjects,index}.ts
│   │   │   ├── services/{projects.service,index}.ts
│   │   │   └── index.ts
│   │   └── settings/
│   │       ├── components/SettingsForm.tsx
│   │       └── index.ts
│   ├── global/
│   │   ├── @types/{api.types,common.types,index}.ts
│   │   ├── components/
│   │   │   ├── shared/{AppHeader,Sidebar,Footer,Loader,ThemeToggle,EmptyState,ErrorState,PageHeader,Providers,index}.tsx
│   │   │   ├── ui/{button,input,card,label,form,dialog,dropdown-menu,skeleton,sonner,tabs,badge,separator,avatar,switch,textarea,index}.tsx
│   │   │   └── index.ts
│   │   ├── config/{env,site,apiClient,index}.ts
│   │   ├── constants/{routes,endpoints,strings,index}.ts
│   │   ├── hooks/{useDebounce,useMediaQuery,useLocalStorage,useToggle,useMounted,index}.ts
│   │   ├── lib/{analytics,index}.ts
│   │   ├── store/{auth.store,ui.store,index}.ts
│   │   ├── utils/{cn,formatDate,formatCurrency,validateEmail,truncate,seo,index}.ts
│   │   └── index.ts
│   └── styles/globals.css
├── .env.example
├── .gitignore
├── .prettierignore
├── .prettierrc.json
├── CLAUDE.md
├── README.md
├── commitlint.config.js
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

## Conventions per folder

### `src/app/`

- `page.tsx` for routes, `layout.tsx` for nested layouts, `loading.tsx` for streaming skeletons, `error.tsx` for boundaries, `not-found.tsx` for 404s.
- Route groups in parens: `(auth)` doesn't appear in the URL but shares a layout.
- Pages stay thin. Compose features, set metadata, that's it.

### `src/features/<feature>/`

- `@types/` — `<feature>.types.ts` for domain models, `<feature>.dto.ts` for request payloads, `<feature>.response.ts` for response shapes, `index.ts` barrel.
- `components/` — feature-only UI. One component per file. PascalCase.
- `hooks/` — feature-only hooks. camelCase starting with `use`.
- `services/` — API calls. One per data domain: `auth.service.ts`, `projects.service.ts`.
- `utils/` — Zod schemas (`<feature>Validator.ts`) and feature-only helpers.
- `actions/` — server actions. Frontend template ships stubs.
- `index.ts` — public API. Re-exports only.

### `src/global/components/ui/`

Shadcn primitives. Lowercase-kebab filenames matching the Shadcn registry: `button.tsx`, `dropdown-menu.tsx`, `dialog.tsx`. Generated with the Shadcn convention so you can swap in additional components from `npx shadcn@latest add ...`.

### `src/global/components/shared/`

Layout-level components and behavior wrappers. PascalCase filenames: `AppHeader.tsx`, `Sidebar.tsx`, `Providers.tsx`. These compose the UI primitives.

### `src/global/config/`

- `env.ts` — single source of truth for env. Anything you'd otherwise read with `process.env.X` goes here.
- `site.ts` — name, description, links, OG image, social handles.
- `apiClient.ts` — the axios instance. Token storage helpers.

### `src/global/constants/`

- `routes.ts` — typed `ROUTES` map. Use `ROUTES.dashboard` instead of `"/dashboard"`.
- `endpoints.ts` — API path constants.
- `strings.ts` — shared user-facing strings.

### `src/global/store/`

Zustand stores. One file per concern. Use `persist` middleware for state that must survive reloads.

### `src/global/utils/`

Pure helpers. Each in its own file. Exported through `index.ts`.
