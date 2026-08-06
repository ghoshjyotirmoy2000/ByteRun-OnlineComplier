import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useLogout, useMe } from "../features/auth/hooks";
import { Spinner } from "../components/Spinner";
import { authenticateSocket } from "../lib/websockets";

export function MainLayout() {
  const { data: user } = useMe();
  const logout = useLogout();

  useEffect(() => {
    if (user) {
      authenticateSocket(user.id);
    }
  }, [user]);

  return (
    <div className="h-screen bg-zinc-950 p-4">
      <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
        <header className="flex shrink-0 items-center justify-between border-b border-zinc-800 px-6 py-3">
          <span className="text-lg font-semibold text-zinc-100">
            byte<span className="text-indigo-400">run</span>
          </span>

          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-400">{user?.username}</span>
            <button
              type="button"
              onClick={() => logout.mutate()}
              disabled={logout.isPending}
              className="flex items-center gap-2 rounded-md border border-zinc-700 px-3 py-1.5 text-sm font-medium text-zinc-300 transition hover:bg-zinc-800 disabled:opacity-60"
            >
              {logout.isPending && <Spinner className="h-4 w-4" />}
              Logout
            </button>
          </div>
        </header>

        <main className="min-h-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
