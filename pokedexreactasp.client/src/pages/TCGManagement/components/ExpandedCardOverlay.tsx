import React, { useEffect, useRef } from "react";
import styled from "@emotion/styled";
import gsap from "gsap";
import { IconX } from "@tabler/icons-react";
import { InteractiveCard } from "./InteractiveCard";
import { MyTcgCardItem } from "@/types/tcg-card-collection.types";

const OverlayContainer = styled("div")<{ visible: boolean }>(({ visible }) => ({
  position: "fixed",
  inset: 0,
  zIndex: 9999, // very high to be above everything
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  pointerEvents: visible ? "all" : "none",
}));

const Backdrop = styled("div")({
  position: "absolute",
  inset: 0,
  background: "rgba(0, 0, 0, 0.6)",
  backdropFilter: "blur(8px)",
  cursor: "pointer",
});

const CardWrapper = styled("div")({
  position: "relative",
  zIndex: 1,
  width: "90vw",
  maxWidth: "480px", // very large card size
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "24px",
});

const CloseButton = styled("button")({
  position: "absolute",
  top: "24px",
  right: "24px",
  background: "rgba(0, 0, 0, 0.5)",
  color: "white",
  border: "2px solid rgba(255, 255, 255, 0.2)",
  borderRadius: "50%",
  width: "48px",
  height: "48px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  zIndex: 2,
  transition: "all 0.2s ease",
  "&:hover": {
    background: "rgba(0, 0, 0, 0.8)",
    transform: "scale(1.1)",
    borderColor: "white",
  },
});

interface ExpandedCardOverlayProps {
  card: MyTcgCardItem | null;
  onClose: () => void;
}

export const ExpandedCardOverlay: React.FC<ExpandedCardOverlayProps> = ({
  card,
  onClose,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const cardWrapRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  // GSAP Animation
  useEffect(() => {
    if (card) {
      // Animate In
      const tl = gsap.timeline();

      tl.fromTo(
        backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" },
      )
        .fromTo(
          cardWrapRef.current,
          { scale: 0.5, y: 50, opacity: 0, rotationY: -15, rotationX: 10 },
          {
            scale: 1,
            y: 0,
            opacity: 1,
            rotationY: 0,
            rotationX: 0,
            duration: 0.5,
            ease: "back.out(1.5)",
          },
          "-=0.2",
        )
        .fromTo(
          infoRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
          "-=0.3",
        );

      // Lock body scroll
      document.body.style.overflow = "hidden";
    } else {
      // Unlock body scroll
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [card]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && card) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [card, onClose]);

  if (!card) return null;

  return (
    <OverlayContainer visible={!!card} ref={overlayRef}>
      <Backdrop ref={backdropRef} onClick={onClose} aria-hidden="true" />

      <CloseButton onClick={onClose} aria-label="Close expanded view">
        <IconX size={24} stroke={2.5} />
      </CloseButton>

      <CardWrapper ref={cardWrapRef}>
        <InteractiveCard
          card={card}
          isSelected={true}
          onClick={() => {}} // no-op since it's already selected
          onKeyDown={() => {}}
        />
      </CardWrapper>
    </OverlayContainer>
  );
};
