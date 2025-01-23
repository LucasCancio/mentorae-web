import { Link, Outlet } from "react-router";

export function AuthLayout() {
  return (
    <div className="grid min-h-screen grid-cols-2 antialiased">
      <div className="flex h-full flex-col justify-between border-r border-foreground/5 bg-muted p-10 text-muted-foreground">
        <Link
          to="/"
          className="flex items-center gap-3 text-lg font-medium text-foreground"
        >
          <img src="/logo.png" alt="Fiaposts" className="h-5 w-5" />
          <span className="font-semibold">Fiaposts</span>
        </Link>

        <footer className="text-sm">
          Painel do professor &copy; Fiaposts - {new Date().getFullYear()}
        </footer>
      </div>

      <div className="relative flex flex-col items-center justify-center">
        <Outlet />
      </div>
    </div>
  );
}
