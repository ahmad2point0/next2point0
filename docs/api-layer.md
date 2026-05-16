# API layer

The API layer has three layers of its own: the axios client, services, and hooks.

```
Component ── uses ──▶ Hook ── wraps ──▶ Service ── calls ──▶ apiClient ──▶ network
```

## `apiClient`

`src/global/config/apiClient.ts` exports a single configured axios instance.

- Base URL from validated env (`env.NEXT_PUBLIC_API_URL`).
- Request interceptor attaches `Authorization: Bearer <access_token>` from the cookie.
- Response interceptor catches `401`, attempts a refresh via `/auth/refresh`, retries the original request once. If refresh fails, tokens are cleared.
- Errors are normalized to `ApiError(message, status, data)`.

Use it like this:

```ts
import { apiClient } from "@/global/config";

const { data } = await apiClient.get("/projects");
```

But you almost never call it directly. Use a service.

## Services

A service is a thin layer that:

- Knows about endpoint paths and request shape.
- Returns typed data.
- Has no React in it (no hooks, no JSX).

```ts
// features/auth/services/auth.service.ts
export const authService = {
  async login(dto: LoginDto): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>(AUTH_ENDPOINTS.login, dto);
    tokenStorage.setAccess(data.accessToken);
    tokenStorage.setRefresh(data.refreshToken);
    return data;
  },
};
```

Endpoint paths come from `src/global/constants/endpoints.ts`. Never inline path strings.

## Hooks

A hook wraps a service with TanStack Query, exposing `data`, `isLoading`, `isError`, `mutate`, etc.

```ts
// features/auth/hooks/useLogin.ts
export function useLogin() {
  const setUser = useAuthStore((s) => s.setUser);
  return useMutation<AuthResponse, Error, LoginDto>({
    mutationFn: (dto) => authService.login(dto),
    onSuccess: (response) => setUser(response.user),
  });
}
```

## Types

Each feature defines:

- `<feature>.types.ts` — domain models the UI uses (e.g., `AuthUser`, `Project`).
- `<feature>.dto.ts` — request payloads (e.g., `LoginDto`).
- `<feature>.response.ts` — server response shapes (e.g., `AuthResponse`).

Keeping these split makes it easy to evolve the wire format independently from the UI model.

## Error handling

- The axios response interceptor converts all errors to `ApiError`.
- Catch in the hook layer when you can recover (retry, rollback). Otherwise let it propagate.
- Surface to users with `toast.error(error.message)`. The template uses `sonner`.

```ts
login.mutate(values, {
  onError: (error) => toast.error(error.message),
  onSuccess: () => toast.success("Welcome back"),
});
```

## Token storage

`tokenStorage` (in `apiClient.ts`) provides:

- `setAccess(token)` / `getAccess()` — short-lived, 7-day cookie expiry.
- `setRefresh(token)` / `getRefresh()` — long-lived, 30-day cookie.
- `clear()` — wipe both.

Cookies are SameSite=lax. The interceptor reads them on every request — there's no localStorage involvement, which avoids XSS risk for the access token.

## Query keys

See [`state-management.md`](state-management.md). Shape: `[feature, scope, ...args]`.

## When to skip the hook

For one-off, non-React contexts (a route handler, a server action), call the service directly. Don't reach for `useQuery` outside of components.

## Adding a new endpoint

1. Add the path to `src/global/constants/endpoints.ts`.
2. Add request and response types to `features/<feature>/@types/`.
3. Add a method to `features/<feature>/services/<feature>.service.ts`.
4. Add a hook in `features/<feature>/hooks/` if components will use it.
5. Re-export from the feature's `index.ts`.

That's the whole flow.
