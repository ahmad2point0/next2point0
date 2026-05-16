"use server";

// Frontend-only template: auth runs against an external API via the service layer.
// On the `feat/backend` branch this file is replaced with server actions backed by Auth.js.
export async function loginAction(): Promise<{ ok: false; reason: string }> {
  return { ok: false, reason: "Use the fullstack template (feat/backend) for server-side auth." };
}
