import { isAxiosError } from "axios";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";

import { Header } from "@/components/header";
import { api } from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";

export function AuthenticatedLayout() {
  const navigate = useNavigate();
  const { token } = useAuthStore();

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
    <div className="flex min-h-screen flex-col antialiased">
      <Header />

      <div className="flex flex-1 flex-col gap-4 p-8 pt-6 max-w-[800px] w-full mx-auto shadow-xl">
        <Outlet />
      </div>
    </div>
  );
}
