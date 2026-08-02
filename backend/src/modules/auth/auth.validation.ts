import z from "zod";

export const RegisterUserSchema = z
  .object({
    username: z.string(),
    email: z.string(),
    password: z.string().min(8, "Password must be at least 8 characters"),

    confirmPassword: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });


  export const LoginUserSchema = z.object({
    email: z.string(),
    password : z.string()
  })


  export type  ResgisterUserDto = z.infer<typeof RegisterUserSchema>;
  export type  LoginUserDto = z.infer<typeof LoginUserSchema>;


