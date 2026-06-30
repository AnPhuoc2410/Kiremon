import styled from "@emotion/styled";

// ─── Constants ────────────────────────────────────────────────────────────────
export const MAP_W = 1600;
export const MAP_H = 900;
export const VIEWPORT_W = 1028;
export const VIEWPORT_H = 560;

// ─── Area background mapping ───────────────────────────────────────────────
const AREA_BACKGROUNDS: Record<string, { day: string; night: string }> = {
  viridian_field: {
    day: "/assets/wild-area/bg-viridian-day.png",
    night: "/assets/wild-area/bg-viridian-night.png",
  },
  misty_lake: {
    day: "/assets/wild-area/bg-beach-day.png",
    night: "/assets/wild-area/bg-beach-night.png",
  },
  rock_tunnel: {
    day: "/assets/wild-area/bg-rock-tunnel-day.png",
    night: "/assets/wild-area/bg-rock-tunnel-night.png",
  },
  ember_volcano: {
    day: "/assets/wild-area/bg-ember-volcano-day.png",
    night: "/assets/wild-area/bg-ember-volcano-night.png",
  },
  haunted_woods: {
    day: "/assets/wild-area/bg-haunted-woods-day.png",
    night: "/assets/wild-area/bg-haunted-woods-night.png",
  },
  power_plant: {
    day: "/assets/wild-area/bg-power-plant-day.png",
    night: "/assets/wild-area/bg-power-plant-night.png",
  },
  frost_cavern: {
    day: "/assets/wild-area/bg-frost-cavern-day.png",
    night: "/assets/wild-area/bg-frost-cavern-night.png",
  },
  ancient_ruins: {
    day: "/assets/wild-area/bg-ancient-ruins-day.png",
    night: "/assets/wild-area/bg-ancient-ruins-night.png",
  },
};

const getFallbackGradient = (areaCode: string, isDaytime: boolean) => {
  if (areaCode?.includes("beach") || areaCode?.includes("water")) {
    return isDaytime
      ? "radial-gradient(ellipse at 30% 60%, #60c8e8 0%, #3fa9cc 40%, #e8c97a 100%)"
      : "radial-gradient(ellipse at 30% 60%, #1a3a5c 0%, #0d2238 50%, #2a1a10 100%)";
  }
  return isDaytime
    ? "radial-gradient(ellipse at 20% 30%, #8de88b 0%, #5aaa5e 40%, #3d7a40 100%)"
    : "radial-gradient(ellipse at 20% 30%, #1a2e1a 0%, #0d1f0d 50%, #081508 100%)";
};

const getBgImage = (areaCode: string, isDaytime: boolean) => {
  const key = Object.keys(AREA_BACKGROUNDS).find((k) => areaCode?.includes(k));
  if (key) {
    const src = isDaytime
      ? AREA_BACKGROUNDS[key].day
      : AREA_BACKGROUNDS[key].night;
    return `url("${src}")`;
  }
  return "none";
};

// ─── Page shell ───────────────────────────────────────────────────────────
export const Page = styled.section`
  max-width: 1100px;
  margin: 0 auto;
  padding: 12px 16px 130px;
`;

// ─── Top controls row ─────────────────────────────────────────────────────
export const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin: 12px 0 16px;
  flex-wrap: wrap;
`;

export const AreaControls = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

export const AreaSelect = styled.select`
  border: 3px solid #1f2937;
  border-radius: 10px;
  background: #fefce8;
  color: #111827;
  padding: 9px 12px;
  font-size: 14px;
  font-weight: 700;
  min-width: 190px;
  font-family: "VT323", monospace;
  cursor: pointer;
  box-shadow: 3px 3px 0 #1f2937;
  transition:
    box-shadow 0.1s,
    transform 0.1s;

  &:hover {
    box-shadow: 1px 1px 0 #1f2937;
    transform: translate(2px, 2px);
  }
`;

// ─── Day / Night indicator ──────────────────────────────────────────────────
export const DayNightIndicator = styled.div<{ $isDay: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: 3px solid #1f2937;
  border-radius: 10px;
  background: ${(p) => (p.$isDay ? "#fef08a" : "#1e293b")};
  color: ${(p) => (p.$isDay ? "#713f12" : "#e2e8f0")};
  font-family: "VT323", monospace;
  font-size: 18px;
  font-weight: 700;
  box-shadow: 3px 3px 0 #1f2937;
  transition: background 0.4s;
  white-space: nowrap;
  user-select: none;

  svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }
`;

// ─── Map viewport (the visible window, clipping everything outside) ──────────
export const MapShell = styled.div<{ $focused: boolean }>`
  position: relative;
  width: 100%;
  max-width: ${VIEWPORT_W}px;
  height: ${VIEWPORT_H}px;
  margin: 0 auto;
  border: 4px solid #1f2937;
  box-shadow: 0 10px 0 #0f172a;
  border-radius: 8px;
  overflow: hidden;
  /* Show keyboard-focus ring when the viewport is focused */
  outline: ${(p) => (p.$focused ? "3px solid #facc15" : "none")};
  outline-offset: 2px;
  cursor: ${(p) => (p.$focused ? "grab" : "pointer")};

  @media (max-width: 768px) {
    height: 300px;
  }
`;

// ─── Map content (the large scrollable canvas that moves inside MapShell) ─────
export const MapContent = styled.div<{ $areaCode: string; $isDay: boolean }>`
  position: absolute;
  width: ${MAP_W}px;
  height: ${MAP_H}px;
  /* will-change hints the browser to composite this layer on the GPU */
  will-change: transform;

  /* Day/night overlay tint */
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: ${(p) => (p.$isDay ? "transparent" : "rgba(10, 15, 40, 0.55)")};
    z-index: 1;
    pointer-events: none;
    transition: background 0.6s ease;
  }

  /* Single stretched background — NO tiling */
  background-image: ${(p) => getBgImage(p.$areaCode, p.$isDay)};
  background-repeat: no-repeat;
  background-size: ${MAP_W}px ${MAP_H}px;
  background-position: 0 0;
  background-color: transparent;

  /* Gradient fallback when no image */
  ${(p) =>
    getBgImage(p.$areaCode, p.$isDay) === "none"
      ? `background: ${getFallbackGradient(p.$areaCode, p.$isDay)};`
      : ""}
`;

// ─── Grid overlay (sits inside MapContent so it scrolls with the map) ─────────
export const GridOverlay = styled.div`
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right, rgba(16, 64, 16, 0.07) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(16, 64, 16, 0.07) 1px, transparent 1px);
  background-size: 32px 32px;
  pointer-events: none;
  z-index: 2;
`;

// ─── Center hint (not authenticated / error) ──────────────────────────────
export const CenterHint = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: 12px 18px;
  background: rgba(15, 23, 42, 0.85);
  border-radius: 8px;
  border: 2px solid #334155;
  z-index: 10;
`;

// ─── WASD / Arrow keys hint overlay (bottom-right of viewport) ────────────────
export const KeyHint = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
  z-index: 20;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  pointer-events: none;
`;

export const KeyRow = styled.div`
  display: flex;
  gap: 2px;
`;

export const KeyCap = styled.span<{ $active?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: 2px solid rgba(255, 255, 255, 0.6);
  border-radius: 4px;
  background: ${(p) =>
    p.$active ? "rgba(250,204,21,0.85)" : "rgba(0,0,0,0.45)"};
  color: ${(p) => (p.$active ? "#111" : "rgba(255,255,255,0.85)")};
  font-family: "VT323", monospace;
  font-size: 13px;
  line-height: 1;
  transition:
    background 0.06s,
    color 0.06s;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.5);
`;

// ─── Spawn button (transparent, sprite sitting on MapContent) ─────────────────
export const SpawnButton = styled.button<{
  x: number;
  y: number;
  disabled?: boolean;
}>`
  position: absolute;
  left: ${(p) => p.x}px;
  top: ${(p) => p.y}px;
  width: 96px;
  height: 96px;
  border: none;
  border-radius: 0;
  background: transparent;
  cursor: ${(p) => (p.disabled ? "not-allowed" : "pointer")};
  opacity: ${(p) => (p.disabled ? 0.45 : 1)};
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 0;
  image-rendering: pixelated;
  z-index: 3;
  filter: ${(p) =>
    p.disabled
      ? "grayscale(0.8) brightness(0.7)"
      : "drop-shadow(0 3px 4px rgba(0,0,0,0.5))"};
  transition:
    filter 0.2s,
    transform 0.2s;

  &:not(:disabled):hover {
    filter: drop-shadow(0 0 8px rgba(255, 230, 0, 0.9))
      drop-shadow(0 3px 4px rgba(0, 0, 0, 0.5));
    transform: scale(1.08);
  }

  img {
    width: 84px;
    height: 84px;
    image-rendering: pixelated;
    object-fit: contain;
  }
`;

// ─── Tip text ─────────────────────────────────────────────────────────────
export const Tip = styled.p`
  margin-top: 14px;
  text-align: center;
  color: #374151;
  font-family: "VT323", monospace;
  font-size: 18px;
  letter-spacing: 0.5px;
`;

// ─── Modal card ───────────────────────────────────────────────────────────
export const ModalCard = styled.div`
  width: min(520px, 92vw);
  background: #ffffff;
  border-radius: 12px;
  border: 3px solid #111827;
  box-shadow:
    0 12px 0 #0f172a,
    6px 18px 0 #111827;
  padding: 20px;
`;

export const ModalRow = styled.div`
  display: flex;
  gap: 14px;
  align-items: center;
  margin: 14px 0;

  img {
    width: 72px;
    height: 72px;
    image-rendering: pixelated;
  }
`;

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
`;

export const Select = styled.select`
  border: 3px solid #1f2937;
  border-radius: 8px;
  padding: 10px;
  font-size: 16px;
  font-family: "VT323", monospace;
  background: #fefce8;
  box-shadow: 2px 2px 0 #1f2937;
`;

export const Actions = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 14px;
  flex-wrap: wrap;
`;

export const RewardCard = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  background: linear-gradient(145deg, #ffffff 0%, #f1f5f9 100%);
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  padding: 24px 16px;

  img {
    width: 200px;
    height: auto;
    object-fit: cover;
    border-radius: 10px;
    box-shadow:
      0 10px 25px -5px rgba(0, 0, 0, 0.3),
      0 8px 10px -6px rgba(0, 0, 0, 0.1);
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;

    &:hover {
      transform: translateY(-4px) scale(1.02);
      box-shadow:
        0 14px 30px -5px rgba(0, 0, 0, 0.4),
        0 10px 12px -6px rgba(0, 0, 0, 0.2);
    }
  }
`;

export const RewardCardInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 4px;

  h3 {
    margin: 0;
    font-size: 22px;
    color: #0f172a;
    font-family: "VT323", monospace;
    letter-spacing: 0.5px;
  }

  p {
    margin: 0;
    font-size: 14px;
    color: #475569;
  }

  .rarity {
    display: inline-block;
    padding: 6px 12px;
    background: #1e293b;
    color: #f8fafc;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 700;
    margin-top: 8px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }
`;

export const TimerText = styled.span`
  font-family: "VT323", monospace;
  font-size: 20px;
  color: #374151;
  letter-spacing: 1px;
`;
