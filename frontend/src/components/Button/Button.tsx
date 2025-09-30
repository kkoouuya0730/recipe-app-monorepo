import clsx from "clsx";
import { ButtonHTMLAttributes, ReactNode } from "react";
import { tv } from "tailwind-variants";
export const buttonColorPropertyValues = ["primary", "secondary", "tertiary", "danger"] as const;
type ButtonColorProperty = (typeof buttonColorPropertyValues)[number];
type Props = {
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  color?: ButtonColorProperty;
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
  disabled: boolean;
  children: ReactNode;
};

export type ButtonProps = Props;

const buttonClassName = tv({
  base: [
    "cursor-pointer rounded-lg py-2 font-bold w-full transition-all ease-in duration-200",
    "focus:ring-[#EEB3D6] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-white",
  ],
  variants: {
    color: {
      primary: "bg-[#A20065] text-white hover:bg-[#A20065]/80",
      secondary: "bg-[#F6C9D7] text-[#A20065] hover:bg-[#F6C9D7]/80",
      tertiary: "bg-white text-[#A20065] border border-[#A20065] hover:bg-[#F6C9D7]/50",
      danger: "bg-[#E57373] text-white hover:bg-[#E57373]/80",
    },
  },
});

export const Button = ({ type = "button", color = "primary", onClick, disabled, children }: Props) => {
  return (
    <button type={type} className={clsx([buttonClassName({ color }), disabled && "bg-gray-300"])} onClick={onClick}>
      {children}
    </button>
  );
};
