import { env } from "@/global/config";

interface TrackPayload {
  event: string;
  properties?: Record<string, unknown>;
}

export const analytics = {
  enabled: !!env.NEXT_PUBLIC_ANALYTICS_ID,
  track({ event, properties }: TrackPayload) {
    if (!this.enabled) return;
    if (typeof window === "undefined") return;
    console.debug("[analytics]", event, properties);
  },
  identify(userId: string, traits?: Record<string, unknown>) {
    if (!this.enabled) return;
    console.debug("[analytics] identify", userId, traits);
  },
};
