"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/global/lib/prisma";
import { profileSchema } from "../utils/profileValidator";

interface ActionFailure {
  ok: false;
  message: string;
  fieldErrors?: Record<string, string[]>;
}

interface ActionSuccess {
  ok: true;
}

export type ProfileActionResult = ActionSuccess | ActionFailure;

export async function updateProfileAction(input: unknown): Promise<ProfileActionResult> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, message: "Not authenticated" };

  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Invalid input",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        bio: parsed.data.bio ?? "",
      },
    });
    revalidatePath("/dashboard/profile");
    return { ok: true };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Unknown error" };
  }
}
