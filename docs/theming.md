# Theming

Class-based dark mode via `next-themes`. Tokens in `src/styles/globals.css`. Tailwind v4.

## How it works

1. `Providers.tsx` wraps the app in `<ThemeProvider attribute="class" defaultTheme="system" enableSystem>`.
2. `next-themes` toggles a `.dark` class on `<html>`.
3. `globals.css` defines two sets of CSS variables: one in `:root` (light), one in `.dark` (dark).
4. Tailwind v4 reads those variables via the `@theme inline` block, turning them into utilities (`bg-background`, `text-foreground`, etc.).
5. The `ThemeToggle` component lets the user switch between Light, Dark, and System.

## Available tokens

- `--background`, `--foreground`
- `--card`, `--card-foreground`
- `--popover`, `--popover-foreground`
- `--primary`, `--primary-foreground`
- `--secondary`, `--secondary-foreground`
- `--muted`, `--muted-foreground`
- `--accent`, `--accent-foreground`
- `--destructive`, `--destructive-foreground`
- `--border`, `--input`, `--ring`
- `--radius`

Each becomes a Tailwind utility class. `--background` → `bg-background`. `--muted-foreground` → `text-muted-foreground`. `--radius` drives `rounded-lg` etc.

## Rule

Don't hardcode colors. Use tokens. If you need a new semantic color, add a new variable to both `:root` and `.dark`, then map it in `@theme inline`.

## Changing the palette

The default palette is neutral grays in OKLCH. To customize:

1. Pick your colors. [oklch.com](https://oklch.com) helps.
2. Edit `src/styles/globals.css` — `:root` for light values, `.dark` for dark values.
3. Keep contrast pairs in sync: every `--*` foreground should have enough contrast over its background.

## Custom utilities

`@custom-variant dark (&:is(.dark *))` lets you write `dark:` prefixes that target descendants of `.dark`. That's why classes like `dark:bg-card` work even though dark mode is on the `<html>` element.

## Theme toggle

`src/global/components/shared/ThemeToggle.tsx`. Uses Lucide icons and the Shadcn dropdown. Renders Light/Dark/System options. Wraps `useTheme()` from `next-themes`.

Hydration: the toggle uses `useMounted()` to avoid icon flash. The body wrapping is `suppressHydrationWarning` because `next-themes` injects a script before React hydrates.

## Fonts

Geist Sans and Geist Mono via `next/font/google`, applied as CSS variables in `RootLayout`:

```tsx
const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
```

Tailwind picks them up through `@theme inline { --font-sans: var(--font-geist-sans); }`. Use `font-sans` / `font-mono` utilities.

## Tailwind v4 notes

- Use canonical class names: `bg-linear-to-br` (not `bg-gradient-to-br`), `supports-backdrop-filter:bg-x` (not `supports-[backdrop-filter]:bg-x`). The ESLint and IDE plugins will warn you.
- Container queries, gradients, and `@starting-style` are first-class.
- The `@import "tailwindcss"` line at the top of `globals.css` replaces the v3 `@tailwind base; @tailwind components; @tailwind utilities;` block.
