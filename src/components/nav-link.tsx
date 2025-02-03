import { Link, LinkProps, useLocation } from "react-router";

export type TNavLinkProps = LinkProps;

export function NavLink(props: TNavLinkProps) {
  const { pathname } = useLocation();

  const isActive = pathname === props.to;

  return (
    <Link
      data-current={isActive}
      className="flex items-center gap-1.5 text-xl font-medium text-muted-foreground hover:text-foreground data-[current=true]:text-foreground"
      {...props}
    />
  );
}
