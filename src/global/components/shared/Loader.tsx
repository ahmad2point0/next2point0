import { Loader2 } from "lucide-react";
import { cn } from "@/global/utils/cn";

interface LoaderProps {
  className?: string;
  label?: string;
  size?: number;
}

export function Loader({ className, label = "Loading", size = 20 }: LoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("text-muted-foreground flex items-center gap-2", className)}
    >
      <Loader2 className="animate-spin" style={{ width: size, height: size }} />
      <span className="sr-only">{label}</span>
    </div>
  );
}
