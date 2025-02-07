import { AccountMenu } from "./account-menu";
import { Logo } from "./logo";
import { Sidebar } from "./sidebar";

export function Header() {
  return (
    <div className="flex h-16 items-center gap-6 px-6">
      <div className="flex gap-2 items-center justify-center text-primary ml-10 md:ml-0">
        <Logo />
      </div>

      <Sidebar />
      <div className="ml-auto flex items-center gap-2">
        <AccountMenu />
      </div>
    </div>
  );
}
