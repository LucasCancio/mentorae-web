import { BookOpen, BookPlus, Notebook } from "lucide-react";
import { SidebarItems } from "@/types";
import { useMediaQuery } from "usehooks-ts";
import { SidebarMobile } from "./sidebar-mobile";
import { NavLink } from "../nav-link";
import { useAuthentication } from "@/contexts/authentication-context";

const sidebarItems: SidebarItems = {
  links: [
    { label: "Posts", href: "/", icon: BookOpen, onlyLogged: false },
    {
      label: "Meus Posts",
      href: "/my-posts",
      icon: Notebook,
      onlyLogged: true,
    },
    {
      label: "Novo post",
      href: "/post-details",
      icon: BookPlus,
      onlyLogged: true,
    },
  ],
};

export function Sidebar() {
  const isDesktop = useMediaQuery("(min-width: 768px)", {
    initializeWithValue: false,
  });

  const { isLoggedIn } = useAuthentication();

  if (isDesktop) {
    return (
      <nav className="flex items-center space-x-4 lg:space-x-6">
        {sidebarItems.links.map((link, idx) => {
          if (link.onlyLogged && !isLoggedIn) return null;

          return (
            <NavLink key={idx} to={link.href}>
              {link.icon && <link.icon className="h-4 w-4" />}
              {link.label}
            </NavLink>
          );
        })}
      </nav>
    );
  }

  return <SidebarMobile sidebarItems={sidebarItems} />;
}
