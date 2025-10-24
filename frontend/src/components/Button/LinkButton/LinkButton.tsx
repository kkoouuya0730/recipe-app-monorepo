import clsx from "clsx";
import Link from "next/link";
import { ReactNode } from "react";
import { tv } from "tailwind-variants";
export const buttonColorPropertyValues = ["primary", "secondary", "tertiary"] as const;
type ButtonColorProperty = (typeof buttonColorPropertyValues)[number];
type Props = {
  href: string;
  color?: ButtonColorProperty;
  children: ReactNode;
};

export type ButtonProps = Props;

const buttonClassName = tv({
  base: [
    "font-bold  cursor-pointer rounded-lg py-2 px-1 font-bold w-full transition-all ease-in duration-200",
    "focus:ring-[#EEB3D6] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-white",
  ],
  variants: {
    color: {
      primary: "bg-[#A20065] text-white hover:bg-[#A20065]/80",
      secondary: "bg-[#F6C9D7] text-[#A20065] hover:bg-[#F6C9D7]/80",
      tertiary: "bg-white text-[#A20065] border border-[#A20065] hover:bg-[#F6C9D7]/50",
    },
  },
});

export const LinkButton = ({ href, color = "primary", children }: Props) => {
  return (
    <Link href={href} className={clsx([buttonClassName({ color })])}>
      {children}
    </Link>
  );
};
