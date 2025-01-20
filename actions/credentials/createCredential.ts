"use server";

import { symmetricEncrypt } from "@/lib/encryption";
import prisma from "@/lib/prisma";
import {
  createCredentialSchema,
  createCredentialSchemaType,
} from "@/schema/credential";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const createCredential = async (form: createCredentialSchemaType) => {
  const { success, data } = await createCredentialSchema.safeParseAsync(form);

  if (!success) {
    throw new Error("Invalid form data");
  }

  const { userId } = auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  //Encrypt the value
  const encryptedValue = symmetricEncrypt(data.value);
  console.log("Plaintext:", data.value);
  console.log("Encrypted:", encryptedValue);
  const result = await prisma.credential.create({
    data: {
      name: data.name,
      value: encryptedValue,
      userId,
    },
  });
  if (!result) {
    throw new Error("Failed to create credential");
  }

  revalidatePath("/credentials");
};
