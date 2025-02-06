import { Logo } from "@/components/logo";
import { Link, Outlet } from "react-router";

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col-reverse md:grid md:grid-cols-[3fr_4fr] antialiased">
      <div className="relative flex flex-col items-center justify-center bg-slate-950 p-10">
        <Logo className="absolute top-8" />
        <Outlet />
      </div>
      <div className="relative h-full flex justify-between border-r rounded-l-md border-foreground/5 bg-primary text-muted-foreground">
        <img src="/images/landing.svg" alt="Educação" className="flex-1" />

        <footer className="text-sm absolute bottom-8 left-1/2 transform -translate-x-1/2">
          FIAP &copy; Mentoraê - 2025
        </footer>
      </div>
    </div>
  );
}
