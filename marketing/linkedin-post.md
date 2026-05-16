# LinkedIn launch post

---

I shipped next2point0 today.

It is the Next.js starter I wish I had every time I started a project.

Most starters give you three files and a checklist of forty things to do before the project feels real. Folder structure. Tailwind. Shadcn. Husky. Prettier. lint-staged. Env validation. Typed API client. Token refresh. SEO. Dark mode. Six hours in and you still have not written a line of product code.

next2point0 ships with all of it done. You install it with one command:

npx next2point0

Two questions. Project name and template type. The CLI picks the right branch, strips the git history, runs bun install. You run bun run dev and you have a real app on localhost:3000.

What is inside:

→ Two templates. Frontend only, or frontend plus backend.
→ Feature-sliced architecture. Each feature owns its types, components, hooks, services. Features do not cross-import.
→ Shadcn UI with proper dark mode through next-themes. No flash.
→ react-hook-form plus zod everywhere. Schema once, validated on the server too in the fullstack branch.
→ TanStack Query for server state. Zustand for client state. No Redux, no Context for things Zustand can do.
→ Axios with token refresh interceptor that compiles.
→ Zod-validated env. Missing variable fails fast with a clear message.
→ Husky pre-commit runs Prettier and ESLint on staged files. pre-push runs typecheck and build. commit-msg enforces Conventional Commits.
→ Working example pages: landing, login, register, dashboard with stats, projects table with empty state, profile editor, settings, custom 404, error boundary.
→ A sample Projects feature that shows the full pattern end to end. Copy it when you add your next feature.
→ CLAUDE.md at the root so AI coding tools follow the conventions instead of fighting them.

The fullstack branch adds Prisma, Auth.js, server actions, protected routes, repository pattern, and a real CRUD example.

Two templates. One CLI. Everything you need on day one.

Repo: github.com/ahmad2point0/next2point0
Docs: in the repo under docs/

If you ship something with it, send it to me. I want to see it.

#nextjs #typescript #react #webdev #startups #opensource #developertools
