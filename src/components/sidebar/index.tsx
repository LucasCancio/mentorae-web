import { BriefcaseBusiness, Presentation } from "lucide-react";
import { SidebarItems } from "@/types";
import { useMediaQuery } from "usehooks-ts";
import { SidebarMobile } from "./sidebar-mobile";
import { NavLink } from "../nav-link";

const sidebarItems: SidebarItems = {
  links: [
    { label: "Mentorias", href: "/", icon: Presentation },
    { label: "Vagas", href: "/jobs", icon: BriefcaseBusiness },
  ],
};

export function Sidebar() {
  const isDesktop = useMediaQuery("(min-width: 768px)", {
    initializeWithValue: false,
  });

  if (isDesktop) {
    return (
      <nav className="flex-1 flex flex-row items-center justify-center space-x-4 lg:space-x-6 gap-4">
        {sidebarItems.links.map((link, idx) => {
          return (
            <NavLink key={idx} to={link.href}>
              {link.icon && <link.icon className="size-6" />}
              {link.label}
            </NavLink>
          );
        })}
      </nav>
    );
  }

  return <SidebarMobile sidebarItems={sidebarItems} />;
}
