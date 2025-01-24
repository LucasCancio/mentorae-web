import { SidebarItems } from "@/types";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { Menu, X } from "lucide-react";
import { SidebarButtonSheet as SidebarButton } from "./sidebar-button";
import { Link, useLocation } from "react-router";
import { useAuthentication } from "@/contexts/authentication-context";

interface SidebarMobileProps {
  sidebarItems: SidebarItems;
}

export function SidebarMobile(props: SidebarMobileProps) {
  const { isLoggedIn } = useAuthentication();
  const { pathname } = useLocation();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="ghost" className="fixed top-3 left-3 z-50">
          <Menu size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="px-3 py-4" hideClose>
        <SheetHeader className="flex flex-row justify-between items-center space-y-0">
          <SheetTitle className="mx-3">Mentorae</SheetTitle>
          <SheetClose asChild>
            <Button className="h-7 w-7 p-0" variant="ghost">
              <X size={15} />
            </Button>
          </SheetClose>
        </SheetHeader>
        <div className="h-full">
          <div className="mt-5 flex flex-col w-full gap-1">
            {props.sidebarItems.links.map((link, idx) => {
              if (link.onlyLogged && !isLoggedIn) return null;

              return (
                <Link key={idx} to={link.href}>
                  <SidebarButton
                    variant={pathname === link.href ? "secondary" : "ghost"}
                    icon={link.icon}
                    className="w-full"
                  >
                    {link.label}
                  </SidebarButton>
                </Link>
              );
            })}
          </div>
        </div>
        <SheetDescription>Menu de navegação</SheetDescription>
      </SheetContent>
    </Sheet>
  );
}
