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
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <span className="text-lg font-semibold text-slate-900">
            LeetCode<span className="text-indigo-600">Clone</span>
          </span>

          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">{user?.username}</span>
            <button
              type="button"
              onClick={() => logout.mutate()}
              disabled={logout.isPending}
              className="flex items-center gap-2 rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
            >
              {logout.isPending && <Spinner className="h-4 w-4" />}
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
