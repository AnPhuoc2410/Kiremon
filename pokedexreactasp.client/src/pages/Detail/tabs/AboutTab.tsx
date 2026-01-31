import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Loading, RelatedPokemon, Text } from "@/components/ui";
import { POKEMON_IMAGE } from "@/config/api.config";
import { pokemonService } from "@/services";
import { pokeItemService } from "@/services/pokeitem/pokeitem.service";
import { RelatedPokemonItem, IPokemonSpecies } from "@/types/pokemon.d";
import * as T from "@/pages/Detail/index.style";
import * as S from "./AboutTab.style";

interface AboutTabProps {
  abilities: Array<{
    ability?: { name: string };
    is_hidden?: boolean;
  }>;
  relatedPokemon: RelatedPokemonItem[];
  specialForms: Array<{
    name: string;
    url: string;
    id?: number;
    is_default?: boolean;
  }>;
  isLoadingRelated: boolean;
  species: IPokemonSpecies | null;
  name: string;
  heldItems?: Array<{
    item: { name: string; url: string };
    version_details: Array<{
      rarity: number;
      version: { name: string; url: string };
    }>;
  }>;
  habitat?: string;
  color?: string;
  shape?: string;
  generation?: string;
  isLegendary?: boolean;
  isMythical?: boolean;
}

interface FormSprite {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
}

interface HeldItemWithSprite {
  name: string;
  sprite: string;
}

const AboutTab: React.FC<AboutTabProps> = ({
  abilities,
  relatedPokemon,
  specialForms,
  isLoadingRelated,
  species,
  name,
  heldItems,
  habitat,
  color,
  shape,
  generation,
}) => {
  const navigate = useNavigate();
  const [formSprites, setFormSprites] = useState<Record<string, FormSprite>>(
    {},
  );
  const [isLoadingSprites, setIsLoadingSprites] = useState<boolean>(false);
  const [heldItemSprites, setHeldItemSprites] = useState<HeldItemWithSprite[]>(
    [],
  );
  const [isLoadingHeldItems, setIsLoadingHeldItems] = useState<boolean>(false);

  const handleHeldItemClick = (itemName: string) => {
    navigate(`/poke-mart?item=${encodeURIComponent(itemName)}`);
  };

  useEffect(() => {
    const loadFormSprites = async () => {
      if (specialForms && specialForms.length > 1) {
        setIsLoadingSprites(true);
        const spriteData: Record<string, FormSprite> = {};

        for (const form of specialForms) {
          try {
            // Extract the form ID from the URL
            const formId = form.url.split("/").filter(Boolean).pop();
            if (formId) {
              const formData = await pokemonService.getPokemonForms(formId);
              spriteData[form.name] = formData;
            }
          } catch (error) {
            console.error(`Error loading form sprite for ${form.name}:`, error);
          }
        }

        setFormSprites(spriteData);
        setIsLoadingSprites(false);
      }
    };

    loadFormSprites();
  }, [specialForms]);

  // Create a stable string key from held item names for effect dependency
  const heldItemNamesKey = useMemo(
    () =>
      heldItems
        ?.map((item) => item.item.name)
        .sort()
        .join("|") || "",
    [heldItems],
  );

  // Load held item sprites using GraphQL
  useEffect(() => {
    const loadHeldItemSprites = async () => {
      if (!heldItemNamesKey) return;

      const itemNames = heldItemNamesKey.split("|").filter(Boolean);
      setIsLoadingHeldItems(true);
      try {
        const sprites = await pokeItemService.getHeldItemSprites(itemNames);
        setHeldItemSprites(sprites);
      } catch (error) {
        console.error("Error loading held item sprites:", error);
        setHeldItemSprites([]);
      } finally {
        setIsLoadingHeldItems(false);
      }
    };

    loadHeldItemSprites();
  }, [heldItemNamesKey]);

  return (
    <>
      {/* Basic Info Section */}
      <S.BasicInfoSection>
        <S.SectionTitle>
          <Text as="h3">Basic Information</Text>
        </S.SectionTitle>
        <S.InfoGrid>
          {generation && (
            <S.InfoItem>
              <S.InfoContent>
                <S.InfoLabel>Generation</S.InfoLabel>
                <S.InfoValue>
                  {generation.replace("generation-", "Gen ")}
                </S.InfoValue>
              </S.InfoContent>
            </S.InfoItem>
          )}
          {color && (
            <S.InfoItem>
              <S.InfoContent>
                <S.InfoLabel>Color</S.InfoLabel>
                <S.InfoValue>{color}</S.InfoValue>
              </S.InfoContent>
            </S.InfoItem>
          )}
          {shape && (
            <S.InfoItem>
              <S.InfoContent>
                <S.InfoLabel>Shape</S.InfoLabel>
                <S.InfoValue>{shape.replace("-", " ")}</S.InfoValue>
              </S.InfoContent>
            </S.InfoItem>
          )}
          {habitat && (
            <S.InfoItem>
              <S.InfoContent>
                <S.InfoLabel>Habitat</S.InfoLabel>
                <S.InfoValue>{habitat.replace("-", " ")}</S.InfoValue>
              </S.InfoContent>
            </S.InfoItem>
          )}
        </S.InfoGrid>
      </S.BasicInfoSection>

      {/* Abilities section */}
      <S.AbilitiesContainer>
        <S.SectionTitle>
          <Text as="h3">Abilities</Text>
        </S.SectionTitle>
        <S.AbilitiesGrid>
          {abilities &&
            abilities.map((ability, index) => (
              <S.AbilityCard key={index} isHidden={ability.is_hidden}>
                <S.AbilityName>
                  {ability.ability?.name.replace("-", " ")}
                </S.AbilityName>
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
            <T.LoadingWrapper>
              <Loading label="Loading related Pokemon data..." />
            </T.LoadingWrapper>
          ) : (
            <RelatedPokemon
              pokemonList={relatedPokemon}
              title={
                species && species.generation
                  ? `Generation ${species.generation.url.split("/").filter(Boolean).pop()} Pokémon`
                  : "Related Pokémon"
              }
            />
          )}
        </S.RelatedPokemonSection>
      )}

      {/* Special forms section (if available) */}
      {specialForms.length > 1 && (
        <S.FormsContainer>
          <Text as="h3">Forms & Variants</Text>
          <S.FormsGrid>
            {isLoadingSprites ? (
              <T.LoadingWrapper>
                <Loading label="Loading form sprites..." />
              </T.LoadingWrapper>
            ) : (
              specialForms.map((form, index) => (
                <S.FormItem key={index}>
                  <LazyLoadImage
                    src={
                      formSprites[form.name]?.sprites?.front_default ||
                      POKEMON_IMAGE +
                        `${form.url.split("/").filter(Boolean).pop()}.png`
                    }
                    alt={form.name}
                    width={80}
                    height={80}
                    effect="blur"
                  />
                  <S.FormName>
                    {form.name.replace(name, "").replace("-", " ").trim() ||
                      "Default"}
                  </S.FormName>
                </S.FormItem>
              ))
            )}
          </S.FormsGrid>
        </S.FormsContainer>
      )}

      {/* Held Items section */}
      {heldItems && heldItems.length > 0 && (
        <S.HeldItemsContainer>
          <Text as="h3">Held Items</Text>
          <S.ItemsGrid>
            {isLoadingHeldItems ? (
              <Loading />
            ) : (
              heldItemSprites.map((item, index) => (
                <S.HeldItemWrapper
                  key={index}
                  onClick={() => handleHeldItemClick(item.name)}
                  title={`View ${item.name.replace(/-/g, " ")} in Poké Mart`}
                >
                  <S.HeldItemImage
                    src={item.sprite}
                    alt={item.name}
                    title={item.name.replace(/-/g, " ")}
                  />
                  <S.HeldItemTooltip>
                    {item.name.replace(/-/g, " ")}
                  </S.HeldItemTooltip>
                </S.HeldItemWrapper>
              ))
            )}
          </S.ItemsGrid>
        </S.HeldItemsContainer>
      )}
    </>
  );
};

export default AboutTab;
