import React, { ButtonHTMLAttributes } from "react";

import styled from "@emotion/styled";
import { units, colors } from "@/components/utils";

const StyledDeleteButton = styled("button")({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "fit-content",
  minWidth: "32px",
  minHeight: "32px",
  padding: units.spacing.xs,
  zIndex: 1,
  cursor: "pointer",
  flexGrow: 0,
  transition:
    "transform 160ms ease, background-color 160ms ease, box-shadow 160ms ease",
  "&:hover": {
    backgroundColor: colors["gray-200"],
    transform: "translateY(-1px)",
  },
  "&:active::after": {
    boxShadow: `inset 4px 4px ${colors["gray-400"]}`,
  },
  "&:active": {
    transform: "translateY(1px)",
  },
  "&:focus-visible": {
    outline: `2px solid ${colors["gray-900"]}`,
    outlineOffset: "2px",
  },
});

const DeleteButton: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({
  ...props
}) => {
  return (
    <StyledDeleteButton className="pxl-border" {...props}>
      <svg
        width="14"
        height="14"
        viewBox="0 0 15 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0 0H3V3H0V0ZM6 6H3V3H6V6ZM9 6H6V9H3V12H0V15H3V12H6V9H9V12H12V15H15V12H12V9H9V6ZM12 3V6H9V3H12ZM12 3V0H15V3H12Z"
          fill={colors["red-400"]}
        />
      </svg>
    </StyledDeleteButton>
  );
};

export default DeleteButton;
