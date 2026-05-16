# Contributing

Thanks for considering a contribution. This template is open source and improvements are welcome.

## Development setup

```bash
git clone https://github.com/ahmad2point0/next2point0.git
cd next2point0
bun install
cp .env.example .env
bun run dev
```

## Branches

- `main` — frontend-only template. Stays shippable.
- `feat/backend` — fullstack template. Inherits `main` (merged forward when `main` gets a useful improvement).

When you fix a bug or add a feature that benefits both templates, make the change on `main` first. We then merge `main` into `feat/backend`.

## Workflow

1. Open an issue describing what you want to change. For small fixes (typos, obvious bugs), skip to step 2.
2. Fork and create a branch: `feat/<short-name>` or `fix/<short-name>`.
3. Make the change. Keep the diff focused — one feature or one fix per PR.
4. Make sure `bun run lint`, `bun run typecheck`, `bun run build` all pass.
5. Commit with [Conventional Commits](https://www.conventionalcommits.org/) — `commitlint` enforces this.
6. Push and open a PR. Fill out the description (what, why, how to test).

## PR requirements

- Conventional Commit-style title.
- Description with: what changed, why, screenshots if UI, manual test steps.
- All CI checks green.
- One reviewer approval before merge.

## Code style

Read [`docs/conventions.md`](conventions.md) and [`CLAUDE.md`](../CLAUDE.md). Highlights:

- Feature-sliced. Features don't import from each other.
- TypeScript strict. No `any`.
- `react-hook-form` + `zod` for all forms.
- Zustand for client state, TanStack Query for server state.
- No comments unless the **why** is non-obvious.
- One component per file. Target ~200 lines.

## What gets accepted

- Bug fixes.
- Improvements to existing features that follow the conventions.
- New shared primitives in `global/components/ui` or `global/components/shared` that are clearly reusable.
- Documentation improvements.
- Performance fixes with measurements.

## What doesn't get accepted

- New top-level features that go beyond the starter's scope (analytics SDKs, payments, internationalization). Those belong in your own app.
- Cosmetic rewrites that don't follow the conventions.
- Adding new state managers or HTTP clients alongside the existing ones.
- Breaking changes without a deprecation path.
- Commented-out code, "added for X" comments, or trailing TODOs.

## Reporting issues

Open a GitHub issue with:

- Template (frontend or fullstack) and branch.
- Bun / Node version.
- OS.
- Steps to reproduce.
- What you expected vs. what happened.
- Error output.

## License

Contributions are licensed under the project's MIT license.
