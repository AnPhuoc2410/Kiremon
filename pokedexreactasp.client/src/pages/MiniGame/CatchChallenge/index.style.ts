import styled from "@emotion/styled";
import { colors, units } from "@/components/utils";
import { CenteredPage, GameCard as BaseGameCard, FlexCenter } from "@/styles";

// ============ LAYOUT ============
export const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: calc(100vh - 80px);
  padding: ${units.spacing.xl};
  padding-top: ${units.spacing.lg};
  position: relative;
`;

export const GameCard = styled(BaseGameCard)`
  width: 100%;
  max-width: 640px;
  padding: ${units.spacing.lg};
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: ${units.spacing.base};
`;

// ============ GAME FIELD ============
export const Field = styled.div`
  height: 260px;
  background: linear-gradient(
    180deg,
    ${colors["green-200"]},
    ${colors["green-300"]}
  );
  border-radius: 12px;
  position: relative;
  overflow: hidden;
`;

export const PokemonSprite = styled.img<{ x: number; y: number }>`
  position: absolute;
  left: ${(props) => props.x}%;
  top: ${(props) => props.y}%;
  width: 96px;
  height: 96px;
  transform: translate(-50%, -50%);
  user-select: none;
  transition:
    left 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    top 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
`;

// ============ THROW AREA ============
export const ThrowArea = styled(FlexCenter)`
  gap: ${units.spacing.sm};
`;
