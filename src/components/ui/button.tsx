import { cva, type VariantProps } from "class-variance-authority";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ButtonHTMLAttributes } from "react";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const buttonVariants = cva("button", {
  variants: {
    variant: {
      default: "button-primary",
      secondary: "button-secondary",
      ghost: "button-ghost",
    },
  },
  defaultVariants: { variant: "default" },
});
export function Button({
  className,
  variant,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>) {
  return (
    <button
      data-slot="button"
      type={type}
      className={cn(buttonVariants({ variant }), className)}
      {...props}
    />
  );
}
