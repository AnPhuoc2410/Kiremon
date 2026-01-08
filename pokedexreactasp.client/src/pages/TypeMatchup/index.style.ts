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
  max-width: 720px;
  padding: ${units.spacing.lg};
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

export const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${units.spacing.sm};
  margin-top: ${units.spacing.base};

  @media (min-width: 640px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

export const OptionButton = styled.button<{
  correct?: boolean;
  wrong?: boolean;
}>`
  padding: ${units.spacing.sm};
  border-radius: 8px;
  border: 2px solid ${colors["gray-300"]};
  background: ${(props) =>
    props.correct
      ? colors["green-200"]
      : props.wrong
        ? colors["red-200"]
        : colors["gray-100"]};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
  }
`;

export const ScoreBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${units.spacing.sm};
`;
