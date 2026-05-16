import { RegisterForm } from "@/features/auth";
import { buildMetadata } from "@/global/utils/seo";

export const metadata = buildMetadata({
  title: "Create account",
  description: "Get started in less than a minute.",
  path: "/register",
});

export default function RegisterPage() {
  return (
    <>
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
        <p className="text-muted-foreground text-sm">It only takes a minute.</p>
      </div>
      <RegisterForm />
    </>
  );
}
