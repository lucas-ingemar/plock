import { Button, type ButtonProps } from "@heroui/react";
import { buttonVariants, tv } from "@heroui/styles";
import type { VariantProps } from "tailwind-variants";

const plockButtonVariants = tv({
  extend: buttonVariants,
  base: "rounded-full font-semibold",
  variants: {
    variant: {
      citrus:
        "bg-citrus text-citrus-foreground hover:bg-citrus-hover data-[hovered=true]:bg-citrus-hover",
    },
    size: {
        xl: "text-xl px-8 h-16"
    },
  },
});

type PlockButtonProps = Omit<ButtonProps, "variant" | "size" | "className"> &
  VariantProps<typeof plockButtonVariants> & {
    className?: string;
  };

export function PlockButton({ variant, size, className, ...props }: PlockButtonProps) {
  return <Button className={plockButtonVariants({ variant, size, className })} {...props} />;
}

