import React from "react";
import { Text, EvolutionChain, Loading } from "../../../components/ui";
import * as T from "../index.style";
import * as S from "./EvolutionTab.style";

interface EvolutionTabProps {
  isLoadingEvolution: boolean;
  evolutionChain: any[];
}

const EvolutionTab: React.FC<EvolutionTabProps> = ({
  isLoadingEvolution,
  evolutionChain,
}) => {
  return (
    <S.EvolutionContainer>
      {isLoadingEvolution ? (
        <S.LoadingContainer>
          <T.LoadingWrapper>
            <Loading label="Loading evolution data..." />
          </T.LoadingWrapper>
        </S.LoadingContainer>
      ) : evolutionChain.length > 0 ? (
        <EvolutionChain evolutions={evolutionChain} />
      ) : (
        <S.NoEvolutionMessage>
          <Text>This Pokémon does not evolve.</Text>
        </S.NoEvolutionMessage>
      )}
    </S.EvolutionContainer>
  );
};

export default EvolutionTab;
