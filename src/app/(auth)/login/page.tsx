import { LoginForm } from "@/features/auth";
import { buildMetadata } from "@/global/utils/seo";

export const metadata = buildMetadata({
  title: "Sign in",
  description: "Access your account.",
  path: "/login",
});

export default function LoginPage() {
  return (
    <>
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground text-sm">Enter your details to sign in.</p>
      </div>
      <LoginForm />
    </>
  );
}
