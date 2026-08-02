import { Navigate, Outlet } from "react-router-dom";
import { useMe } from "../features/auth/hooks";
import { FullScreenLoader } from "../components/Spinner";

export function PublicRoute() {
  const { data: user, isLoading } = useMe();

  if (isLoading) {
    return <FullScreenLoader />;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
