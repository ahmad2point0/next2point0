# Scripts

| Script                 | Command                | What it does                                   |
| ---------------------- | ---------------------- | ---------------------------------------------- |
| `bun run dev`          | `next dev`             | Start dev server with Turbopack                |
| `bun run build`        | `next build`           | Production build                               |
| `bun run start`        | `next start`           | Run the production build                       |
| `bun run lint`         | `eslint`               | Lint with ESLint                               |
| `bun run lint:fix`     | `eslint --fix`         | Lint and auto-fix                              |
| `bun run typecheck`    | `tsc --noEmit`         | TypeScript type check                          |
| `bun run format`       | `prettier --write ...` | Format the whole repo                          |
| `bun run format:check` | `prettier --check ...` | Verify formatting without writing              |
| `bun run prepare`      | `husky`                | Install Husky hooks (runs after `bun install`) |

## Git hook scripts

These are not in `package.json` — they run automatically.

| Hook         | What it does                               |
| ------------ | ------------------------------------------ |
| `pre-commit` | `bunx lint-staged`                         |
| `commit-msg` | `bunx --no-install commitlint --edit "$1"` |
| `pre-push`   | `bun run typecheck && bun run build`       |

### `lint-staged` config (in `package.json`)

- `*.{ts,tsx,js,jsx}` → `prettier --write` then `eslint --fix`
- `*.{json,md,mdx,css}` → `prettier --write`

## When hooks misbehave

- **Pre-commit blocks a commit you actually want.** Don't use `--no-verify`. Fix the issue, run `bun run lint:fix`, stage the fixes, re-commit.
- **Pre-push fails on `build`.** Run `bun run build` locally to see the error in full. Usually a type error introduced after the last typecheck.
- **`commit-msg` rejects your message.** Use Conventional Commits format. See [`conventions.md`](conventions.md).

## When to skip hooks

Rarely. If you must, set `HUSKY=0` in your shell. Open a follow-up PR to fix what was broken.

```bash
HUSKY=0 git push
```

Do not commit changes to `.husky/` that disable hooks.
