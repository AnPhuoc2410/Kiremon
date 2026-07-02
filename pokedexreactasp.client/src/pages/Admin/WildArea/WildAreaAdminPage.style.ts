import styled from "@emotion/styled";
import { colors } from "@/components/utils";

export const PageHeader = styled.h1`
  font-family: "VT323", monospace;
  font-size: 48px;
  margin: 0 0 24px 0;
  color: ${colors["gray-900"]};
  text-shadow: 2px 2px 0px rgba(0, 0, 0, 0.1);
`;

export const Page = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 16px;

  @media (min-width: 768px) {
    align-items: center;
  }
`;

export const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Actions = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

export const TabContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  background: ${colors["gray-100"]};
  padding: 8px;
  border-radius: 12px;
  border: 4px solid ${colors["gray-900"]};
  box-shadow: 4px 4px 0 ${colors["gray-900"]};
  width: fit-content;
`;

export const TabButton = styled.button<{ $active: boolean }>`
  background: ${(p) => (p.$active ? colors["gray-900"] : "transparent")};
  color: ${(p) => (p.$active ? "#ffffff" : colors["gray-900"])};
  border: 3px solid ${(p) => (p.$active ? colors["gray-900"] : "transparent")};
  border-radius: 8px;
  padding: 8px 16px;
  font-family: "VT323", monospace;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: ${(p) => (p.$active ? colors["gray-900"] : colors["gray-300"])};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

export const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

export const Card = styled.div`
  background: ${colors["gray-100"]};
  border: 4px solid ${colors["gray-900"]};
  border-radius: 12px;
  padding: 24px;
  box-shadow: 4px 4px 0 ${colors["gray-900"]};
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 3px dashed ${colors["gray-300"]};

  h3 {
    margin: 0;
    font-size: 24px;
    font-family: "VT323", monospace;
    color: ${colors["gray-900"]};
  }

  svg {
    width: 24px;
    height: 24px;
    color: ${colors["gray-900"]};
  }
`;

export const FormGroup = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const Label = styled.label`
  font-family: "VT323", monospace;
  font-size: 20px;
  color: ${colors["gray-900"]};
  display: block;
`;

export const Description = styled.p`
  margin: 0;
  font-size: 16px;
  color: ${colors["gray-900"]};
  opacity: 0.8;
  font-family: "VT323", monospace;
`;

export const Input = styled.input`
  font-family: "VT323", monospace;
  font-size: 18px;
  padding: 10px 14px;
  background: #ffffff;
  border: 3px solid ${colors["gray-900"]};
  border-radius: 8px;
  color: ${colors["gray-900"]};
  box-shadow: 2px 2px 0 ${colors["gray-900"]};
  outline: none;
  transition: transform 0.1s;

  &:focus {
    transform: translate(-1px, -1px);
    box-shadow: 3px 3px 0 ${colors["blue-500"]};
    border-color: ${colors["blue-500"]};
  }
`;

export const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  padding: 16px;
  border: 3px solid ${colors["gray-900"]};
  border-radius: 8px;
  box-shadow: 2px 2px 0 ${colors["gray-900"]};
`;

// Background mapping similar to WildArea page
const AREA_BACKGROUNDS: Record<string, string> = {
  viridian_field: "/assets/wild-area/bg-viridian-day.png",
  misty_lake: "/assets/wild-area/bg-beach-day.png",
  rock_tunnel: "/assets/wild-area/bg-rock-tunnel-day.png",
  ember_volcano: "/assets/wild-area/bg-ember-volcano-day.png",
  haunted_woods: "/assets/wild-area/bg-haunted-woods-day.png",
  power_plant: "/assets/wild-area/bg-power-plant-day.png",
  frost_cavern: "/assets/wild-area/bg-frost-cavern-day.png",
  ancient_ruins: "/assets/wild-area/bg-ancient-ruins-day.png",
};

export const AreaCard = styled(Card)<{ $areaCode: string }>`
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image: ${(p) => {
      const key = Object.keys(AREA_BACKGROUNDS).find((k) =>
        p.$areaCode?.includes(k),
      );
      return key ? `url("${AREA_BACKGROUNDS[key]}")` : "none";
    }};
    background-size: cover;
    background-position: center;
    opacity: 0.15;
    z-index: 0;
    pointer-events: none;
  }

  > * {
    position: relative;
    z-index: 1;
  }
`;

export const AreaHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
`;

export const AreaBadge = styled.div`
  background: ${colors["gray-900"]};
  color: #ffffff;
  padding: 4px 10px;
  border-radius: 6px;
  font-family: "Fira Code", monospace;
  font-size: 13px;
  border: 2px solid ${colors["gray-900"]};
  box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.2);
`;

export const WeightsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 12px;
  margin-top: 12px;
`;

export const WeightInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: #ffffff;
  padding: 10px;
  border: 3px solid ${colors["gray-900"]};
  border-radius: 8px;
  box-shadow: 2px 2px 0 ${colors["gray-900"]};

  label {
    font-size: 16px;
    text-transform: capitalize;
    color: ${colors["gray-900"]};
    font-family: "VT323", monospace;
  }

  input {
    width: 100%;
    border: 2px solid ${colors["gray-300"]};
    border-radius: 4px;
    padding: 6px;
    font-family: "VT323", monospace;
    font-size: 16px;
    outline: none;

    &:focus {
      border-color: ${colors["blue-500"]};
    }
  }
`;

export const StyledCheckbox = styled.input`
  appearance: none;
  width: 28px;
  height: 28px;
  border: 3px solid ${colors["gray-900"]};
  border-radius: 6px;
  background: #ffffff;
  cursor: pointer;
  position: relative;
  box-shadow: 2px 2px 0 ${colors["gray-900"]};

  &:checked {
    background: ${colors["green-500"]};
  }

  &:checked::after {
    content: "X";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-family: "VT323", monospace;
    color: #ffffff;
    font-size: 20px;
  }
`;

export const Divider = styled.div`
  width: 100%;
  height: 3px;
  background-image: linear-gradient(
    to right,
    ${colors["gray-900"]} 50%,
    transparent 50%
  );
  background-size: 10px 10px;
  background-repeat: repeat-x;
  margin: 20px 0;
`;
