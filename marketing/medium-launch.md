# Why I built next2point0, a Next.js starter that respects your time

I have started too many Next.js projects.

You know the drill. You run `create-next-app`, and you get a clean folder with three files and a TODO list of forty things before the project feels real. Set up the folder structure. Wire Tailwind. Add Shadcn. Decide where to put hooks. Argue with yourself about whether to use Zustand or Context. Build a header. Build a footer. Build a 404. Build an error boundary. Add Prettier. Add ESLint. Add Husky. Add lint-staged. Add commitlint. Add SEO helpers. Add a typed env loader. Add a typed API client. Add token refresh. Add a theme toggle that doesn't flash on load.

Six hours later you still have not written a line of product code.

I have done this dance more times than I can count, and every time the answers ended up being roughly the same. Same folder structure. Same libraries. Same patterns. The difference between any two of my projects, before product code, was rounding error.

So I built next2point0. It is the Next.js starter I wish existed when I started a new project last month, and the month before that, and the month before that. It is not a tutorial. It is not a course. It is a real codebase you clone and start shipping in.

You install it with one command:

```bash
npx next2point0
```

The CLI asks for a project name. It asks if you want the frontend template or the frontend plus backend template. It clones, strips the git history, and runs `bun install`. Then you run `bun run dev`, and you have a real app on `localhost:3000`. Landing page. Login. Register. Dashboard with stats cards. Profile editor. Settings with notification toggles. Dark mode. Empty states. Error boundaries. All of it working, all of it production grade.

This post is the long version of why it exists, what is inside it, and how it scales.

## The thing I kept getting wrong

Most starters group code by type. Components in one folder, hooks in another, API calls in a third. That works when you have eight components. It falls apart at eighty.

The mistake is that nothing in your codebase grows by type. Things grow by feature. You ship a billing module, and it brings new components, new hooks, new types, new API calls. With type-based folders, that new feature spreads across four folders. Reviewing it means tab-hopping. Deleting it means search-and-pray.

I switched to feature slices a few projects ago and never went back.

A feature slice is just a folder named after a piece of your domain. Inside it lives everything that piece of the domain needs:

```
src/features/projects/
├── @types/projects.types.ts
├── services/projects.service.ts
├── hooks/useProjects.ts
├── components/ProjectCard.tsx
├── components/ProjectsTable.tsx
└── index.ts
```

To delete the projects feature you delete the folder. To understand the projects feature you read one folder. To enforce that features stay independent, you only import from the feature's `index.ts`. If you find yourself importing from `@/features/projects/components/ProjectCard` from inside `@/features/auth`, you stop and ask why an auth component knows about a project card. Usually the answer is that the thing you wanted was actually shared, and it should live in `global/` instead.

next2point0 ships with this structure already wired up. There is an example `projects` feature that demonstrates the whole pattern. Types, mock service, query hook, table component with loading and empty states, page that just composes the table. You copy that pattern when you add your second feature, and your third, and your tenth.

## What lives in the template

Two branches. Same architecture. Different scope.

The **frontend template** sits on `main`. It assumes you have an API somewhere else (your own backend, a SaaS API, a Supabase project). Everything in the template is the client side: the routes, the components, the state, the data fetching. It ships with Shadcn UI, Tailwind v4, next-themes for dark mode, react-hook-form plus zod for forms, TanStack Query for server state, Zustand for client state, axios with a token refresh interceptor that actually compiles, and a typed env loader so a missing variable fails fast instead of crashing in production.

The **fullstack template** sits on `feat/backend`. It is the frontend template plus everything you need when the backend lives in the same app. Prisma for the database. Auth.js for sessions. Server actions for mutations. A protected dashboard that actually checks the session. A repository pattern between your services and Prisma so your data access is consistent. Zod validates request shapes on the server, using the same schema that validates the form on the client.

You pick the one you need. You will not regret it later when scope changes — the fullstack template is a strict superset of the frontend one, so you can graduate by merging when the time comes.

## The folder structure, in plain English

I will walk through the top-level layout once, because it is the thing you need to understand to use the template effectively.

```
src/
├── app/                  Next.js App Router
├── features/             One folder per business feature
└── global/               Shared across features
```

That is the whole shape.

`app/` is just Next.js routes. Pages and layouts. The rule is that pages stay thin. A page sets its metadata and composes a feature component. No business logic. No data fetching. The `dashboard/page.tsx` file is twelve lines.

`features/` is where the work happens. Each feature is a folder with the same internal shape: types, components, hooks, services, utils, a barrel `index.ts`. A feature owns its own types and its own data. Features do not import from other features. If two features need the same thing, that thing is not a feature, it is shared, and it moves to `global/`.

`global/` is everything cross-cutting. The Shadcn UI primitives. The shared header, sidebar, footer. The configured axios instance. The Zustand stores. The validated env. The Tailwind tokens. The SEO helper. The constants for routes and endpoints and user-facing strings.

The whole structure is captured in `docs/folder-structure.md` if you want the byte-by-byte reference.

## How state actually works

There are two kinds of state in any app. Server state, which lives on a server and you cache locally. Client state, which lives in the browser and never goes to a server.

For server state, the answer is TanStack Query. Every network call is wrapped in a hook with a query key shaped `[feature, scope, ...args]`. So `["projects", "list"]` or `["projects", id]`. When you mutate a project and want every projects query to refresh, you invalidate the `["projects"]` key family. One line, all of it refetches.

For client state, the answer is `useState` first. If exactly one component cares, you do not lift the state. If two components care, you reach for Zustand. There is no Context, because Context exists to do what Zustand does with more code. There is no Redux, because nothing in a normal product app needs the ceremony.

The auth store is persisted with Zustand's `persist` middleware, so a refresh keeps the user signed in. The UI store holds throwaway things like whether the sidebar is collapsed. That is the whole state story.

## The forms story

Forms are where most projects stop being type safe. The user types into an input, the input gives you a string, you parse it by hand, you do not parse it well, and somewhere a downstream function gets a number when it expected a date.

next2point0 forces one stack for every form: react-hook-form plus zod plus the Shadcn `Form*` components.

You write the schema once in `features/<feature>/utils/<feature>Validator.ts`. The form imports the schema and its inferred type. The submit handler receives values that are already validated. There is nothing to check at runtime. Errors render automatically through `FormMessage`. The same schema can be imported by a server action and used to validate the incoming request body, which means client and server agree on what valid input looks like, by construction.

The login form, the register form, the profile editor, all written the same way. When you add your own form, you copy the pattern.

## The developer experience

Half the value of a starter is in things you do not see.

When you commit, Husky runs lint-staged, which runs Prettier and ESLint on the files you touched. If anything fails, the commit is rejected, and you fix the issue and commit again. Husky also runs commitlint on your message, so your history stays clean enough to generate changelogs from. When you push, Husky runs the type checker and a full build, so a typo or a type error never gets pushed to a branch that other people will pull.

The env loader is validated. Every variable goes through a Zod schema in `src/global/config/env.ts`. If you forget to set `NEXT_PUBLIC_API_URL`, the app fails on the first import with a clear message that tells you what is missing. No more digging through a runtime stack trace trying to figure out why an axios call is hitting `undefined/auth/login`.

The dark mode toggle does not flash on load. The header does not jump when the theme switches. The skeleton states match the layout that loads on top of them. The empty states have a single shared component, and so do the error states, so the UI feels coherent even on broken inputs.

These are small things. They add up to a starter that feels finished, not abandoned halfway.

## Scaling out

The structure scales because nothing in it knows about the size of the project. A folder with two features looks like a folder with twenty. A barrel export with three lines looks like a barrel export with twenty.

When the team grows, you add a `.github/CODEOWNERS` and assign features to teams. The auth team owns `features/auth/`. The platform team owns `global/`. Reviews route automatically. Nobody has to ask who should approve a change.

When the project grows beyond one app, you turn the repo into a monorepo. `apps/web/` is the current project. `packages/ui/` becomes what used to be in `global/components/ui/`. `packages/config/` becomes what was in `global/config/`. The feature slices inside the app do not change. The pattern travels.

When the project gets faster than your performance budget can keep up with, you split bundles per route. Next.js makes this easy when the code is already organized by feature, because a feature already maps to a route group or two. You do not have to untangle anything.

The general principle: the same shape, scaled. Three features, thirty features, three hundred. The decisions you make on day one keep being right.

## Why npx and not the other ways

You can clone the repo with `git clone`. You can fork it. You can copy and paste files out of it. All of those work.

The CLI exists because there is a difference between cloning a starter and starting from a starter. When you clone, you inherit the project's git history, its `.git` folder, its remote. You have to remember to nuke them. You have to remember to rename it. You have to remember to overwrite the README. You have to remember a list of things that should not be your problem.

The CLI does the things you should not have to remember. It asks for your project name. It picks the right branch based on the template you want. It clones with `--single-branch` so you do not pull two templates worth of history. It removes `.git`. It runs `bun install`. You go from zero to a working dev server in under a minute.

```bash
npx next2point0
```

One command. Two questions. A working app.

## What is next

I am keeping the templates current. New Next.js versions, new Shadcn components, new Tailwind features land in next2point0 when they land upstream. The frontend template stays the canonical version, and improvements flow into the fullstack template by merge.

Things on the near-term list: a CLI option to skip installing dependencies, a test setup branch with Vitest and Playwright, a Stripe-ready fork of the fullstack template. None of these are needed by everyone, so they will live on separate branches or in a different template entirely, not in the core ones.

If you find a bug or want to suggest an improvement, the repo is at <https://github.com/ahmad2point0/next2point0>. Open an issue. Or a PR.

If you ship something with it, I would love to hear about it. I am [@ahmad2point0](https://twitter.com/ahmad2point0) on Twitter.

Go build the thing you have been putting off.

```bash
npx next2point0
```
