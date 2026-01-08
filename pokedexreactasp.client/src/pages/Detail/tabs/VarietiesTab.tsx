import React, { useEffect, useState } from "react";
import { Loading, Text, PokeCard } from "../../../components/ui";
import { pokemonService } from "../../../services";
import * as T from "../index.style";
import * as S from "./VarietiesTab.style";
import { IVariety } from "../../../types/pokemon";

interface VarietiesTabProps {
  varieties: IVariety[];
  currentPokemonName: string;
}

interface VarietyDetail {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
  types: Array<{
    type: {
      name: string;
    };
  }>;
}

const VarietiesTab: React.FC<VarietiesTabProps> = ({
  varieties,
  currentPokemonName,
}) => {
  const [varietyDetails, setVarietyDetails] = useState<
    Record<string, VarietyDetail>
  >({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadVarietyDetails = async () => {
      if (varieties && varieties.length > 0) {
        setIsLoading(true);
        const details: Record<string, VarietyDetail> = {};

        for (const variety of varieties) {
          try {
            const varietyData = await pokemonService.getPokemonDetail(
              variety.pokemon.name,
            );
            if (varietyData) {
              details[variety.pokemon.name] = {
                id: varietyData.id,
                name: varietyData.name,
                sprites: varietyData.sprites,
                types: varietyData.types,
              };
            }
          } catch (error) {
            console.error(
              `Error loading variety ${variety.pokemon.name}:`,
              error,
            );
          }
        }

        setVarietyDetails(details);
        setIsLoading(false);
      }
    };

    loadVarietyDetails();
  }, [varieties]);

  if (!varieties || varieties.length === 0) {
    return (
      <T.LoadingWrapper>
        <Text>No varieties available for this Pokémon.</Text>
      </T.LoadingWrapper>
    );
  }

  if (isLoading) {
    return (
      <T.LoadingWrapper>
        <Loading />
      </T.LoadingWrapper>
    );
  }

  return (
    <S.VarietiesContainer>
      <Text as="h3">Varieties</Text>
      <Text size="sm" style={{ marginTop: "8px", color: "#6B7280" }}>
        Different forms and variations of this Pokémon
      </Text>

      <S.VarietiesGrid>
        {varieties.map((variety, index) => {
          const detail = varietyDetails[variety.pokemon.name];

          if (!detail) return null;

          const isCurrentPokemon = variety.pokemon.name === currentPokemonName;

          return (
            <div key={index} style={{ position: "relative" }}>
              <PokeCard
                name={detail.name}
                pokemonId={detail.id}
                sprite={detail.sprites.front_default}
                types={detail.types.map((t) => t.type.name)}
              />
              {variety.is_default && <S.DefaultBadge>Default</S.DefaultBadge>}
              {isCurrentPokemon && <S.CurrentBadge>Current</S.CurrentBadge>}
            </div>
          );
        })}
      </S.VarietiesGrid>
    </S.VarietiesContainer>
  );
};

export default VarietiesTab;
