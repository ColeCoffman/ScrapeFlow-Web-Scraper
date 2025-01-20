"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const deleteCredential = async (credentialName: string) => {
  const { userId } = await auth();
  if (!userId) {
    return { error: "Unauthorized" };
  }

  await prisma.credential.delete({
    where: {
      userId_name: {
        userId,
        name: credentialName,
      },
    },
  });

  revalidatePath("/credentials");
};
