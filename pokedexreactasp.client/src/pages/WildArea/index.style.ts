import styled from "@emotion/styled";

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

// ─── Map shell ────────────────────────────────────────────────────────────
export const MapShell = styled.div<{ $areaCode: string; $isDay: boolean }>`
  position: relative;
  width: 100%;
  max-width: 860px;
  height: 460px;
  margin: 0 auto;
  border: 4px solid #1f2937;
  box-shadow: 0 10px 0 #0f172a;
  border-radius: 8px;
  overflow: hidden;
  image-rendering: pixelated;

  /* Day/night overlay tint on top of background image */
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: ${(p) => (p.$isDay ? "transparent" : "rgba(10, 15, 40, 0.55)")};
    z-index: 1;
    pointer-events: none;
    transition: background 0.6s ease;
  }

  /* Background image, falls back to gradient */
  background-image: ${(p) => getBgImage(p.$areaCode, p.$isDay)};
  background-size: cover;
  background-position: center;
  background-color: transparent;

  /* Gradient fallback (shown when no image) */
  ${(p) =>
    getBgImage(p.$areaCode, p.$isDay) === "none"
      ? `background: ${getFallbackGradient(p.$areaCode, p.$isDay)};`
      : ""}

  @media (max-width: 768px) {
    height: 300px;
  }
`;

// ─── Grid overlay ─────────────────────────────────────────────────────────
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

// ─── Spawn button (transparent, sprite sitting on map) ────────────────────
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
  margin-top: 12px;
  border: 2px solid #cbd5e1;
  border-radius: 10px;
  padding: 10px;
  display: grid;
  grid-template-columns: 56px 1fr;
  gap: 10px;
  align-items: center;
  background: #f8fafc;

  img {
    width: 56px;
    height: 80px;
    object-fit: cover;
    border-radius: 6px;
    border: 1px solid #94a3b8;
  }
`;

export const TimerText = styled.span`
  font-family: "VT323", monospace;
  font-size: 20px;
  color: #374151;
  letter-spacing: 1px;
`;
