"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export const GetCredentialsForUser = async () => {
  const { userId } = auth();

  if (!userId) {
    throw new Error("unauthenticated");
  }

  const credentials = await prisma.credential.findMany({
    where: {
      userId,
    },
    orderBy: {
      name: "asc",
    },
  });

  return credentials;
};
