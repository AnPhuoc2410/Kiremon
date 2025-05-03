import React from 'react';
import { Text } from '../../../components/ui';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import * as T from '../index.style';
import { RelatedPokemon } from '../../../components/ui';
import * as S from './AboutTab.style';

interface AboutTabProps {
  abilities: Array<{
    ability?: { name: string };
    is_hidden?: boolean;
  }>;
  relatedPokemon: any[];
  specialForms: any[];
  isLoadingRelated: boolean;
  species: any;
  name: string;
}

const AboutTab: React.FC<AboutTabProps> = ({
  abilities,
  relatedPokemon,
  specialForms,
  isLoadingRelated,
  species,
  name
}) => {
  return (
    <>
      {/* Abilities section */}
      <S.AbilitiesContainer>
        <Text as="h3">Abilities</Text>
        <S.AbilitiesGrid>
          {abilities && abilities.map((ability, index) => (
            <S.AbilityCard
              key={index}
              isHidden={ability.is_hidden}
            >
              <S.AbilityName>{ability.ability?.name.replace('-', ' ')}</S.AbilityName>
              {ability.is_hidden && (
                <S.AbilityHiddenLabel>(Hidden)</S.AbilityHiddenLabel>
              )}
            </S.AbilityCard>
          ))}
        </S.AbilitiesGrid>
      </S.AbilitiesContainer>

      {/* Related Pokemon section */}
      {(relatedPokemon.length > 0 || isLoadingRelated) && (
        <S.RelatedPokemonSection>
          {isLoadingRelated ? (
            <T.DescriptionLoadingWrapper>
              <div>Loading related Pokémon...</div>
            </T.DescriptionLoadingWrapper>
          ) : (
            <RelatedPokemon
              pokemonList={relatedPokemon}
              title={species && species.generation ?
                `Generation ${species.generation.url.split('/').filter(Boolean).pop()} Pokémon` :
                'Related Pokémon'}
            />
          )}
        </S.RelatedPokemonSection>
      )}

      {/* Special forms section (if available) */}
      {specialForms.length > 1 && (
        <S.FormsContainer>
          <Text as="h3">Forms & Variants</Text>
          <S.FormsGrid>
            {specialForms.map((form, index) => (
              <S.FormItem key={index}>
                <LazyLoadImage
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${form.url.split('/').filter(Boolean).pop()}.png`}
                  alt={form.name}
                  width={80}
                  height={80}
                  effect="blur"
                />
                <S.FormName>
                  {form.name.replace(name, '').replace('-', ' ').trim() || 'Default'}
                </S.FormName>
              </S.FormItem>
            ))}
          </S.FormsGrid>
        </S.FormsContainer>
      )}
    </>
  );
};

export default AboutTab;