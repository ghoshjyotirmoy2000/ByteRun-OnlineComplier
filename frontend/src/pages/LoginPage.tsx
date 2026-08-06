import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";
import { FormField } from "../components/FormField";
import { Spinner } from "../components/Spinner";
import { useLogin } from "../features/auth/hooks";
import { getErrorMessage } from "../lib/api";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginPage() {
  const login = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  return (
    <form
      onSubmit={handleSubmit((data) => login.mutate(data))}
      className="flex flex-col gap-4"
      noValidate
    >
      <h2 className="text-lg font-semibold text-zinc-100">
        Log in to your account
      </h2>

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
        autoComplete="current-password"
        error={errors.password?.message}
        {...register("password")}
      />

      {login.isError && (
        <p className="rounded-md bg-red-950/50 px-3 py-2 text-sm text-red-400">
          {getErrorMessage(login.error, "Unable to log in")}
        </p>
      )}

      <button
        type="submit"
        disabled={login.isPending}
        className="flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:opacity-60"
      >
        {login.isPending && <Spinner className="h-4 w-4" />}
        Log in
      </button>

      <p className="text-center text-sm text-zinc-400">
        Don't have an account?{" "}
        <Link to="/register" className="font-medium text-indigo-400 hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}
