import React, { ButtonHTMLAttributes } from "react";

import styled from "@emotion/styled";
import { IconX } from "@tabler/icons-react";
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
      <IconX size={18} stroke={2.5} color={colors["red-400"]} />
    </StyledDeleteButton>
  );
};

export default DeleteButton;
