import type { InputHTMLAttributes } from "react";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function FormField({ label, error, id, ...inputProps }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-zinc-300">
        {label}
      </label>
      <input
        id={id}
        {...inputProps}
        className={`w-full rounded-md border bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:ring-2 focus:ring-indigo-500/50 ${
          error
            ? "border-red-500/60 focus:border-red-500"
            : "border-zinc-700 focus:border-indigo-500"
        }`}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
