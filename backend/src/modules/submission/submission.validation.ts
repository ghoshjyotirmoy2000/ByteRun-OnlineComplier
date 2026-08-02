import { z } from "zod";

export const CodeSchema = z.object({
  code: z
    .string()
    .min(1, "Code is required")
    .max(100_000, "Code is too large"),

  language: z.enum(["javascript", "java", "cpp" , "python"]),

  input: z
    .string()
    .max(10_000, "Input is too large")
    .optional()
    .default(""),
});

export type CodeSchemaDto = z.infer<typeof CodeSchema>

