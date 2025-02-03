import { Link, Outlet } from "react-router";

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col-reverse md:grid md:grid-cols-[3fr_4fr] antialiased">
      <div className="relative flex flex-col items-center justify-center">
        <Outlet />
      </div>
      <div className="flex flex-1 h-full flex-col justify-between border-r border-foreground/5 bg-primary p-10 text-muted-foreground">
        <Link
          to="/"
          className="flex items-center gap-3 text-lg font-medium text-foreground"
        >
          <img src="/images/logo.png" alt="Mentoraê" className="size-10" />
          <h2 className="text-4xl font-semibold">Mentoraê</h2>
        </Link>

        <img src="/images/landing.svg" alt="Educação" />

        <footer className="text-sm">FIAP &copy; Mentoraê - 2025</footer>
      </div>
    </div>
  );
}
