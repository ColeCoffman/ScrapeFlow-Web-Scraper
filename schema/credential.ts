import { z } from "zod";

export const createCredentialSchema = z.object({
  name: z.string().min(1).max(30),
  value: z.string().min(1).max(500),
});

export type createCredentialSchemaType = z.infer<typeof createCredentialSchema>;
