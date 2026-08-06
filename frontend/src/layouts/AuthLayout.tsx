import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-zinc-100">
            byte<span className="text-indigo-400">run</span>
          </h1>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 shadow-sm">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
