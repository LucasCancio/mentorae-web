import { isAxiosError } from "axios";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";

import { Header } from "@/components/header";
import { api } from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";

export function AuthenticatedLayout() {
  const navigate = useNavigate();
  const { token } = useAuthStore();

  /*  const { data: profile, isLoading: isLoadingProfile } = useProfile();

  useEffect(() => {
    if (!isLoadingProfile && !profile) {
      toast.error("Você precisa estar logado para acessar essa página.");
      navigate("/");
    }
  }, [profile, isLoadingProfile]) */

  useEffect(() => {
    const responseInterceptorId = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (isAxiosError(error)) {
          const status = error.response?.status;
          if (status === 401) {
            navigate("/sign-in", { replace: true });
          }
        } else {
          throw error;
        }
      }
    );

    const requestInterceptorId = api.interceptors.request.use((config) => {
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    });

    return () => {
      api.interceptors.response.eject(responseInterceptorId);
      api.interceptors.request.eject(requestInterceptorId);
    };
  }, [navigate, token]);

  return (
    <div className="flex min-h-screen flex-col antialiased bg-background">
      <Header />

      <div className="mt-8 flex flex-1 flex-col gap-4 max-w-[800px] w-full mx-auto">
        <Outlet />
      </div>
    </div>
  );
}
