import React, { HTMLAttributes, useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { colors } from "@/components/utils";

export interface IModal extends HTMLAttributes<HTMLDialogElement> {
  open: boolean;
  onClose?: () => void;
  overlay?: "dark" | "light" | "error" | "dark-translucent";
  solid?: boolean;
}

const StyledDialog = styled.dialog<{
  $overlay: "dark" | "light" | "error" | "dark-translucent";
  $solid?: boolean;
}>(({ $overlay = "dark", $solid = false }) => ({
  border: "none",
  padding: 0,
  margin: "auto",
  background: "transparent",
  color: "inherit",
  maxWidth: "100vw",
  maxHeight: "100vh",
  width: "100%",
  height: "100%",
  overscrollBehavior: "contain",
  alignItems: "center",
  justifyContent: "center",
  "&[open]": {
    display: "flex",
  },
  "&:not([open])": {
    display: "none",
  },
  "&::backdrop": {
    overflow: "hidden",
    overscrollBehavior: "contain",
    background:
      $overlay === "dark"
        ? colors["gray-800"]
        : $overlay === "light"
          ? colors["gray-100"]
          : $overlay === "dark-translucent"
            ? "rgba(0, 0, 0, 0.4)"
            : colors["red-500"],
    opacity: $overlay === "dark-translucent" ? 1 : $solid ? 1 : 0.9,
  },
  "> div": {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
}));

const Modal: React.FC<IModal> = ({
  children,
  open,
  onClose,
  overlay = "dark",
  solid,
  ...rest
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [open]);

  return (
    <StyledDialog
      ref={dialogRef}
      $overlay={overlay}
      $solid={solid}
      onCancel={(e) => {
        if (onClose) {
          e.preventDefault();
          onClose();
        }
      }}
      {...rest}
    >
      <div>{children}</div>
    </StyledDialog>
  );
};

export default Modal;
