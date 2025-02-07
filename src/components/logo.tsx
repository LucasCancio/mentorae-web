import { twMerge } from "tailwind-merge";

type Props = {
  className?: string;
};

export function Logo({ className }: Props) {
  return (
    <img
      src="/images/logo-with-text.svg"
      alt="Mentoraê"
      className={twMerge("w-32 h-auto", className)}
    />
  );
}
