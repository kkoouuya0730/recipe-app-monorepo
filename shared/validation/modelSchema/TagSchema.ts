import { z } from "zod";

/////////////////////////////////////////
// TAG SCHEMA
/////////////////////////////////////////

export const TagSchema = z.object({
  id: z.number().int(),
  name: z.string(),
});

export type Tag = z.infer<typeof TagSchema>;
