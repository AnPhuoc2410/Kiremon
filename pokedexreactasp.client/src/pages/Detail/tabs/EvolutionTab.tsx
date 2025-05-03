import React from 'react';
import { Text, EvolutionChain } from '../../../components/ui';
import * as T from '../index.style';
import * as S from './EvolutionTab.style';

interface EvolutionTabProps {
  isLoadingEvolution: boolean;
  evolutionChain: any[];
}

const EvolutionTab: React.FC<EvolutionTabProps> = ({
  isLoadingEvolution,
  evolutionChain
}) => {
  return (
    <S.EvolutionContainer>
      {isLoadingEvolution ? (
        <S.LoadingContainer>
          <T.DescriptionLoadingWrapper>
            <div>Loading evolution data...</div>
          </T.DescriptionLoadingWrapper>
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