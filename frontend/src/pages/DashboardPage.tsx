import { useMe } from "../features/auth/hooks";

export function DashboardPage() {
  const { data: user } = useMe();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Welcome back{user ? `, ${user.username}` : ""}
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          This is your dashboard. Problems, submissions, and stats will show up here.
        </p>
      </div>

      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
        Nothing here yet — problem list coming soon.
      </div>
    </div>
  );
}
