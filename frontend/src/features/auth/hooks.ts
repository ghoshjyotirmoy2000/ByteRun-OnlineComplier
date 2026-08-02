import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { fetchMe, loginUser, logoutUser, registerUser } from "./api";
import type { User } from "./types";

export const meQueryKey = ["me"] as const;

export const useMe = () =>
  useQuery({
    queryKey: meQueryKey,
    queryFn: fetchMe,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

export const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (user: User) => {
      queryClient.setQueryData(meQueryKey, user);
      navigate("/dashboard", { replace: true });
    },
  });
};

export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      navigate("/login", { replace: true });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.setQueryData(meQueryKey, null);
      queryClient.clear();
      navigate("/login", { replace: true });
    },
  });
};
