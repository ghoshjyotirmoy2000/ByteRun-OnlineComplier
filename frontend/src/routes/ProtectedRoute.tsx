import { Navigate, Outlet } from "react-router-dom";
import { useMe } from "../features/auth/hooks";
import { FullScreenLoader } from "../components/Spinner";

export function ProtectedRoute() {
  const { data: user, isLoading, isError } = useMe();

  if (isLoading) {
    return <FullScreenLoader />;
  }

  if (isError || !user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
