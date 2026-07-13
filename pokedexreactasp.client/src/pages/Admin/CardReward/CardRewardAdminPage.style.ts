import styled from "@emotion/styled";
import { colors } from "@/components/utils";

export const Page = styled.section`
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const PageHeader = styled.h1`
  font-family: "VT323", monospace;
  font-size: 48px;
  margin: 0 0 8px 0;
  color: ${colors["gray-900"]};
  text-shadow: 2px 2px 0px rgba(0, 0, 0, 0.1);
`;

export const PageSubtitle = styled.p`
  font-family: "VT323", monospace;
  font-size: 20px;
  color: ${colors["gray-900"]};
  opacity: 0.7;
  margin: 0 0 32px 0;
`;

export const TopRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-bottom: 28px;
  flex-wrap: wrap;
`;

export const Card = styled.div`
  background: ${colors["gray-100"]};
  border: 4px solid ${colors["gray-900"]};
  border-radius: 12px;
  padding: 28px;
  box-shadow: 4px 4px 0 ${colors["gray-900"]};
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 14px;
  border-bottom: 3px dashed ${colors["gray-300"]};

  h3 {
    margin: 0;
    font-size: 26px;
    font-family: "VT323", monospace;
    color: ${colors["gray-900"]};
  }

  svg {
    width: 26px;
    height: 26px;
    color: ${colors["gray-900"]};
  }
`;

export const CardDescription = styled.p`
  font-family: "VT323", monospace;
  font-size: 18px;
  color: ${colors["gray-900"]};
  opacity: 0.75;
  margin: 0 0 24px 0;
`;

/** Rarity colours matching TCG tier conventions */
const RARITY_COLORS: Record<
  string,
  { bg: string; border: string; label: string }
> = {
  Common: { bg: "#f1f5f9", border: "#94a3b8", label: "#475569" },
  Uncommon: { bg: "#f0fdf4", border: "#4ade80", label: "#166534" },
  Rare: { bg: "#eff6ff", border: "#60a5fa", label: "#1d4ed8" },
  HoloRare: { bg: "#faf5ff", border: "#c084fc", label: "#7e22ce" },
  UltraRare: { bg: "#fff7ed", border: "#fb923c", label: "#9a3412" },
  SecretRare: { bg: "#fef2f2", border: "#f87171", label: "#991b1b" },
  Promo: { bg: "#fef08a", border: "#eab308", label: "#854d0e" },
  Unknown: { bg: "#f3f4f6", border: "#d1d5db", label: "#374151" },
};

export const WeightsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 16px;
`;

export const WeightCard = styled.div<{ $rarity: string }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: ${(p) => RARITY_COLORS[p.$rarity]?.bg ?? "#f8fafc"};
  padding: 14px 12px;
  border: 3px solid
    ${(p) => RARITY_COLORS[p.$rarity]?.border ?? colors["gray-300"]};
  border-radius: 10px;
  box-shadow: 2px 2px 0 ${colors["gray-900"]};
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;

  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 4px 4px 0 ${colors["gray-900"]};
  }
`;

export const WeightLabel = styled.label<{ $rarity: string }>`
  font-family: "VT323", monospace;
  font-size: 17px;
  color: ${(p) => RARITY_COLORS[p.$rarity]?.label ?? colors["gray-900"]};
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  pointer-events: none;
`;

export const WeightInput = styled.input`
  width: 100%;
  border: 2px solid ${colors["gray-300"]};
  border-radius: 6px;
  padding: 8px 10px;
  font-family: "VT323", monospace;
  font-size: 20px;
  color: ${colors["gray-900"]};
  background: #ffffff;
  outline: none;
  box-sizing: border-box;
  transition:
    border-color 0.15s,
    box-shadow 0.15s;

  &:focus {
    border-color: ${colors["blue-500"]};
    box-shadow: 0 0 0 2px ${colors["blue-500"]}33;
  }
`;

export const TotalRow = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 3px dashed ${colors["gray-300"]};
`;

export const TotalLabel = styled.span`
  font-family: "VT323", monospace;
  font-size: 20px;
  color: ${colors["gray-900"]};
  opacity: 0.8;
`;

export const TotalValue = styled.span<{ $ok: boolean }>`
  font-family: "VT323", monospace;
  font-size: 22px;
  color: ${(p) => (p.$ok ? colors["green-600"] : colors["red-600"])};
  font-weight: bold;
`;
