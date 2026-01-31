import React, { ButtonHTMLAttributes } from "react";
import styled from "@emotion/styled";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { Text } from "..";
import { units, colors } from "@/components/utils";

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "light" | "dark" | "sky" | "primary" | "secondary";
  size?: "sm" | "md" | "lg" | "xl";
  icon?: string;
}

const getStyle = ({ variant = "sky" }: IButtonProps) => {
  const style = {
    display: "flex",
    gap: units.spacing.sm,
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
  };

  switch (variant) {
    case "light":
      return {
        ...style,
        background: colors["yellow-300"],
        "&:not(.no-inset)::after": {
          boxShadow: `inset -4px -4px ${colors["yellow-300"]}`,
        },
        "&:hover": {
          backgroundColor: colors["yellow-100"],
        },
        "&:active::after": {
          boxShadow: `inset 4px 4px ${colors["yellow-300"]}`,
        },
      };
    case "dark":
      return {
        ...style,
        background: colors["red-700"],
        "&:not(.no-inset)::after": {
          boxShadow: `inset -4px -4px ${colors["red-600"]}`,
        },
        "&:hover": {
          backgroundColor: colors["red-500"],
        },
        "&:active::after": {
          boxShadow: `inset 4px 4px ${colors["red-300"]}`,
        },
      };
    case "primary":
      return {
        ...style,
        background: colors["blue-700"],
        "&:not(.no-inset)::after": {
          boxShadow: `inset -4px -4px ${colors["blue-600"]}`,
        },
        "&:hover": {
          backgroundColor: colors["blue-500"],
        },
        "&:active::after": {
          boxShadow: `inset 4px 4px ${colors["blue-300"]}`,
        },
      };
    case "secondary":
      return {
        ...style,
        background: colors["purple-700"],
        "&:not(.no-inset)::after": {
          boxShadow: `inset -4px -4px ${colors["purple-600"]}`,
        },
        "&:hover": {
          backgroundColor: colors["purple-500"],
        },
        "&:active::after": {
          boxShadow: `inset 4px 4px ${colors["purple-300"]}`,
        },
      };
    default:
      return {
        ...style,
        background: colors["sky-200"],
        "&:not(.no-inset)::after": {
          boxShadow: `inset -4px -4px ${colors["sky-300"]}`,
        },
        "&:hover": {
          backgroundColor: colors["sky-100"],
        },
        "&:active::after": {
          boxShadow: `inset 4px 4px ${colors["sky-300"]}`,
        },
      };
  }
};

const PixelatedButton = styled("button")((props: IButtonProps) =>
  getStyle(props),
);

// Map Button sizes to Text sizes
const getTextSize = (
  buttonSize: "sm" | "md" | "lg" | "xl",
): "base" | "lg" | "xl" => {
  switch (buttonSize) {
    case "sm":
      return "base";
    case "md":
      return "base";
    case "lg":
      return "lg";
    case "xl":
      return "xl";
    default:
      return "base";
  }
};

// Get icon size based on button size
const getIconSize = (buttonSize: "sm" | "md" | "lg" | "xl"): number => {
  switch (buttonSize) {
    case "sm":
      return 12;
    case "md":
      return 16;
    case "lg":
      return 20;
    case "xl":
      return 40;
    default:
      return 20;
  }
};

const Button: React.FC<IButtonProps> = ({
  children,
  size = "lg",
  icon,
  ...props
}) => {
  const textSize = getTextSize(size);
  const iconSize = getIconSize(size);

  return (
    <PixelatedButton className="pxl-border" {...props}>
      {icon && (
        <LazyLoadImage
          src={icon}
          alt="button icon"
          width={iconSize}
          height={iconSize}
        />
      )}
      <Text variant="outlined" size={textSize}>
        {children}
      </Text>
    </PixelatedButton>
  );
};

export default Button;
