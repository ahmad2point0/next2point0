# State management

Two tools, one decision rule.

| Kind of state | Use                   | Where                                         |
| ------------- | --------------------- | --------------------------------------------- |
| Server state  | TanStack Query        | Inside a feature hook (`useProjects`, etc.)   |
| Client state  | `useState` or Zustand | Local first, lift to Zustand only when shared |

That's the whole rule. The rest of this doc explains how to apply it.

## Server state

Anything that comes from the network is server state. Don't put server data in Zustand. Don't put server data in React Context. Use TanStack Query.

```ts
// features/projects/hooks/useProjects.ts
export function useProjects() {
  return useQuery({
    queryKey: ["projects", "list"],
    queryFn: () => projectsService.list(),
  });
}
```

### Query key shape

`[feature, scope, ...args]`:

- `["projects", "list"]`
- `["projects", id]`
- `["projects", "search", query]`
- `["dashboard", "overview"]`

Consistent shape makes invalidation predictable: `queryClient.invalidateQueries({ queryKey: ["projects"] })` clears every project query.

### Mutations

```ts
export function useCreateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateProjectInput) => projectsService.create(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["projects"] }),
  });
}
```

For optimistic updates use `onMutate` + `onError` rollback. See TanStack Query docs.

### Defaults

Configured in `Providers.tsx`:

- `staleTime: 60_000` — one minute. Most reads can use the cached value.
- `refetchOnWindowFocus: false` — opt in per query if needed.
- `retry: 1` — one retry, then surface the error.

## Client state

### Local first

```tsx
const [open, setOpen] = useState(false);
```

If only one component cares, don't lift it.

### Zustand when shared

When two or more components need the same value, lift to a Zustand store:

```ts
// global/store/ui.store.ts
export const useUiStore = create<UiState>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
}));
```

Read with selectors to avoid unnecessary re-renders:

```tsx
const collapsed = useUiStore((s) => s.sidebarCollapsed);
```

### Persistence

For values that must survive a reload (auth user shell, theme, recent searches), use the `persist` middleware:

```ts
export const useAuthStore = create<AuthState>()(
  persist((set) => ({ user: null, setUser: (user) => set({ user }) }), {
    name: "next2point0.auth",
  }),
);
```

Storage key prefix is the project name to avoid collisions when running multiple apps locally.

### No Context

You can do everything Context does with Zustand, with less boilerplate and better re-render control. Don't add Context unless you're integrating with a library that requires it.

### No Redux

Zustand handles every case Redux was created for, in a fraction of the code. If you need time-travel debugging, use the Zustand devtools middleware.

## URL state

Use the URL as a state container when it's user-meaningful (filters, search, tabs, pagination). Read with `useSearchParams`, write with `router.replace` / `router.push`. Don't sync URL state back into Zustand.

## Form state

Use `react-hook-form`. Don't manage form state with `useState` or Zustand. See [`forms-and-validation.md`](forms-and-validation.md).

## Where things live

```
src/global/store/
├── auth.store.ts   — current user shell, isAuthenticated, persisted
├── ui.store.ts     — sidebar, command palette
└── index.ts        — barrel
```

Feature-specific stores can live under `features/<feature>/store/` if needed, but most features don't need one — TanStack Query handles their data and local `useState` handles their UI.
