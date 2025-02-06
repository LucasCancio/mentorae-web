import { Link } from "react-router";
import { twMerge } from "tailwind-merge";

type Props = {
  className?: string;
};

export function Logo({ className }: Props) {
  return (
    <Link
      className={twMerge(
        "flex items-center gap-3 text-lg font-medium text-foreground",
        className
      )}
      to="/"
    >
      <img src="/images/logo.png" alt="Mentoraê" className="size-9" />
      <h2 className="text-4xl font-semibold">Mentoraê</h2>
    </Link>
  );
}
