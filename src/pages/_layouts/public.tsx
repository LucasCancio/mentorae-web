import { Logo } from "@/components/logo";
import { Outlet } from "react-router";

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col-reverse md:grid md:grid-cols-[3fr_4fr] antialiased">
      <div className="relative flex flex-col items-center justify-center bg-background p-10">
        <Logo className="absolute top-0 size-40" />
        <Outlet />
      </div>
      <div className="relative max-h-full flex justify-between rounded-lg border-foreground/5 bg-primary text-muted border-background m-8 box-border">
        <img src="/images/landing.svg" alt="Educação" className="flex-1" />

        <footer className="text-sm absolute bottom-8 left-1/2 transform -translate-x-1/2">
          FIAP &copy; Mentoraê - 2025
        </footer>
      </div>
    </div>
  );
}
