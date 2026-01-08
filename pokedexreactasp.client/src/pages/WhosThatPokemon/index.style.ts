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
  position: relative; /* Add position context */
`;

export const GameCard = styled.div`
  width: 100%;
  max-width: 500px;
  padding: ${units.spacing.lg};
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative; /* Add position context */
  z-index: 1; /* Ensure card is above other elements */
`;

export const PokemonImage = styled.div`
  width: 250px;
  height: 250px;
  margin: ${units.spacing.lg} 0;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  /* Pokemon image should not interfere with form inputs */
  pointer-events: none;
`;

export const SilhouetteWrapper = styled.div`
  width: 100%;
  height: 100%;
  filter: brightness(0);
  transition: filter 0.5s ease;

  &.revealed {
    filter: brightness(1);
  }
  /* Images should not capture pointer events */
  pointer-events: none;
`;

export const ScoreDisplay = styled.div`
  margin-top: ${units.spacing.xs};
  padding: ${units.spacing.sm} ${units.spacing.lg};
  background: ${colors["yellow-300"]};
  border-radius: 20px;
  font-weight: bold;
  z-index: 2;
`;

export const GuessForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 320px;
  gap: ${units.spacing.xs};
  margin-top: ${units.spacing.lg};
  position: relative; /* Add position context */
  z-index: 10; /* Ensure form is above other elements */
`;

export const GuessInput = styled.input`
  padding: ${units.spacing.xs};
  width: 100%;
  font-size: 16px;
  border: 2px solid ${colors["gray-300"]};
  border-radius: 4px;
  z-index: 11; /* Ensure input is interactive */
  position: relative;

  &:focus {
    outline: 2px solid ${colors["sky-300"]};
    border-color: ${colors["sky-300"]};
  }
`;

export const ResultMessage = styled.div<{ isCorrect?: boolean }>`
  margin-top: ${units.spacing.xs};
  padding: ${units.spacing.xs};
  background-color: ${(props) =>
    props.isCorrect ? colors["green-300"] : colors["red-300"]};
  border-radius: 8px;
  text-align: center;
  font-weight: bold;
  animation: fadeIn 0.3s;
  z-index: 2;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export const ButtonsContainer = styled.div`
  display: flex;
  gap: ${units.spacing.xs};
  margin-top: ${units.spacing.lg};
  justify-content: center;
  width: 100%;
  z-index: 10;
  position: relative;
`;
