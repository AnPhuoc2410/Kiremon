import styled from "@emotion/styled";
import { colors, units } from "../../components/utils";

export const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: ${units.spacing.xl};
  background-color: ${colors["sky-100"]};
`;

export const GameCard = styled.div`
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

export const Field = styled.div`
  height: 260px;
  background: linear-gradient(180deg, ${colors["green-200"]}, ${colors["green-300"]});
  border-radius: 12px;
  position: relative;
  overflow: hidden;
`;

export const PokemonSprite = styled.img<{x:number;y:number}>`
  position: absolute;
  left: ${p => p.x}%;
  top: ${p => p.y}%;
  width: 96px;
  height: 96px;
  transform: translate(-50%, -50%);
  user-select: none;
`;

export const ThrowArea = styled.div`
  display: flex;
  justify-content: center;
  gap: ${units.spacing.sm};
`;
