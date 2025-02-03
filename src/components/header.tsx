import { AccountMenu } from "./account-menu";
import { Sidebar } from "./sidebar";

export function Header() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center gap-6 px-6">
        <div className="flex gap-2 items-center justify-center text-primary">
          <img
            src="/images/logo.png"
            alt="Mentoraê"
            className="size-7 ml-10 md:ml-0"
          />
          <h2 className="text-xl font-semibold hidden md:inline-block bg-gradient-to-r from-primary via-secondary to-tertiary text-transparent bg-clip-text">
            Mentoraê
          </h2>
        </div>

        <Sidebar />
        <div className="ml-auto flex items-center gap-2">
          <AccountMenu />
        </div>
      </div>
    </div>
  );
}
