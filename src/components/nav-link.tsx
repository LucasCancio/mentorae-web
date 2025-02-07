import { Link, LinkProps, useLocation } from "react-router";
import { twMerge } from "tailwind-merge";

export type TNavLinkProps = LinkProps;

export function NavLink({ className, ...props }: TNavLinkProps) {
  const { pathname } = useLocation();

  const isActive = pathname === props.to;

  return (
    <Link
      data-current={isActive}
      className={twMerge(
        "flex items-center gap-1.5 text-xl font-semibold text-muted hover:text-[#a943fc] data-[current=true]:text-primary",
        className
      )}
      {...props}
    />
  );
}
