"use client";

import { useEffect } from "react";
import { Button } from "@/global/components/ui/button";
import { ErrorState } from "@/global/components/shared/ErrorState";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto max-w-2xl px-4 py-16">
      <ErrorState
        title="Something went wrong"
        description={error.message || "An unexpected error happened."}
      />
      <div className="mt-4 flex justify-center">
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  );
}
