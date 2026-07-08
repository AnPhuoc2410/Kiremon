import React, { useRef, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import gsap from "gsap";
import { IconCards } from "@tabler/icons-react";

import * as S from "./index.style";
const PC_ROUTE = "/my-pokemon";
const TCG_ROUTE = "/tcg-management";

const TITLES = {
  pc: "Pokémon PC Storage",
  tcg: "TCG Card Management",
} as const;

interface StorageHeaderProps {
  actions?: React.ReactNode;
}

const StorageHeader: React.FC<StorageHeaderProps> = ({ actions }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isTcg = pathname.startsWith(TCG_ROUTE);

  const titleRef = useRef<HTMLHeadingElement>(null);
  const switchRef = useRef<HTMLButtonElement>(null);
  const isAnimatingRef = useRef(false);

  // Keep title text in sync on hard navigation (back/forward button, direct URL)
  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.textContent = isTcg ? TITLES.tcg : TITLES.pc;
    }
  }, [isTcg]);

  // ── GSAP flip animation ────────────────────────────────────────────────────
  const handleSwitch = useCallback(() => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    const target = titleRef.current;
    const btn = switchRef.current;
    if (!target) {
      isAnimatingRef.current = false;
      return;
    }

    const nextTitle = isTcg ? TITLES.pc : TITLES.tcg;
    const nextRoute = isTcg ? PC_ROUTE : TCG_ROUTE;

    // Add glitch CSS class for a brief flash on the button
    btn?.classList.add("flipping");
    setTimeout(() => btn?.classList.remove("flipping"), 350);

    // 3-D flip: rotate to 90° (title hidden), swap text, rotate back to 0°
    const tl = gsap.timeline({
      onComplete: () => {
        isAnimatingRef.current = false;
      },
    });

    tl.to(target, {
      rotateX: -90,
      opacity: 0,
      duration: 0.22,
      ease: "power2.in",
      transformOrigin: "center bottom",
    })
      .call(() => {
        target.textContent = nextTitle;
        // Navigate AFTER the text has swapped but before it becomes visible
        navigate(nextRoute);
      })
      .fromTo(
        target,
        { rotateX: 90, opacity: 0 },
        {
          rotateX: 0,
          opacity: 1,
          duration: 0.3,
          ease: "back.out(1.4)",
          transformOrigin: "center top",
        },
      );
  }, [isTcg, navigate]);

  return (
    <S.HeaderRoot className="pxl-border no-inset">
      {/* ── Title with 3D flip wrapper ── */}
      <S.TitleWrap>
        <S.TitleText ref={titleRef}>
          {isTcg ? TITLES.tcg : TITLES.pc}
        </S.TitleText>
      </S.TitleWrap>

      {/* ── Right actions ── */}
      <S.RightSection>
        {/* Injected page-specific buttons (Help, Boxes, etc.) */}
        {actions}

        {/* ── Mode switch button ── */}
        <S.SwitchWrapper
          ref={switchRef}
          isTcg={isTcg}
          onClick={handleSwitch}
          title={
            isTcg
              ? "Switch to Pokémon PC Storage"
              : "Switch to TCG Card Management"
          }
          aria-label={
            isTcg
              ? "Switch to Pokémon PC Storage"
              : "Switch to TCG Card Management"
          }
          aria-pressed={isTcg}
        >
          {isTcg ? (
            <IconCards size={16} stroke={2} />
          ) : (
            <IconCards size={16} stroke={1.5} />
          )}
          <S.SwitchTrack isTcg={isTcg} />
          <span className="label-text">{isTcg ? "TCG Mode" : "PC Mode"}</span>
        </S.SwitchWrapper>
      </S.RightSection>
    </S.HeaderRoot>
  );
};

export default StorageHeader;
