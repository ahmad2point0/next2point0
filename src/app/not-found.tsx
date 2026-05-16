import Link from "next/link";
import { Button } from "@/global/components/ui/button";
import { ROUTES } from "@/global/constants";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-muted-foreground text-sm font-medium">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Page not found</h1>
      <p className="text-muted-foreground mt-3 max-w-md">
        The page you were looking for has moved or never existed.
      </p>
      <div className="mt-6">
        <Button asChild>
          <Link href={ROUTES.home}>Go home</Link>
        </Button>
      </div>
    </div>
  );
}
