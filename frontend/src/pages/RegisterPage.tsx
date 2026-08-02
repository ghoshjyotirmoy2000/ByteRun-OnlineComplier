import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";
import { FormField } from "../components/FormField";
import { Spinner } from "../components/Spinner";
import { useRegister } from "../features/auth/hooks";
import { getErrorMessage } from "../lib/api";

const registerSchema = z
  .object({
    username: z.string().min(1, "Username is required"),
    email: z.string().min(1, "Email is required").email("Enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const registerUser = useRegister();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  return (
    <form
      onSubmit={handleSubmit((data) => registerUser.mutate(data))}
      className="flex flex-col gap-4"
      noValidate
    >
      <h2 className="text-lg font-semibold text-slate-900">
        Create your account
      </h2>

      <FormField
        id="username"
        label="Username"
        autoComplete="username"
        error={errors.username?.message}
        {...register("username")}
      />

      <FormField
        id="email"
        label="Email"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />

      <FormField
        id="password"
        label="Password"
        type="password"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register("password")}
      />

      <FormField
        id="confirmPassword"
        label="Confirm password"
        type="password"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      {registerUser.isError && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {getErrorMessage(registerUser.error, "Unable to create account")}
        </p>
      )}

      <button
        type="submit"
        disabled={registerUser.isPending}
        className="flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-60"
      >
        {registerUser.isPending && <Spinner className="h-4 w-4" />}
        Sign up
      </button>

      <p className="text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-indigo-600 hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
