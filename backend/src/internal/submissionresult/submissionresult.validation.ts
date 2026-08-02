import z from "zod";

export const SubmitResultSchema = z.object({
    output : z.string(),
    executionTime : z.number(),
    error : z.string().default("")
})

export type SubmitResultSchemaDto = z.infer<typeof SubmitResultSchema>