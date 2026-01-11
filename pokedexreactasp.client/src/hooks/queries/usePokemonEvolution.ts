import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  pokemonGraphQLService,
  EvolutionChainGraphQL,
} from "../../services/pokemon/pokemon-graphql.service";
import { EvolutionItem } from "../../types/pokemon.d";

/**
 * Process evolution chain from GraphQL data into UI-friendly format
 */
async function processEvolutionChain(
  chainData: EvolutionChainGraphQL,
): Promise<EvolutionItem[]> {
  const evolutions: EvolutionItem[] = [];
  const speciesList = chainData.pokemonspecies;

  type EvolutionSpecies = (typeof speciesList)[0];

  // Collect all held_item_ids to fetch their names
  const heldItemIds: number[] = [];
  for (const species of speciesList) {
    for (const evoDetail of species.pokemonevolutions) {
      if (evoDetail.held_item_id) {
        heldItemIds.push(evoDetail.held_item_id);
      }
    }
  }

  // Fetch held item names
  const heldItemMap = await pokemonGraphQLService.getItemsByIds(heldItemIds);

  // Build a map of species for quick lookup
  const speciesMap = new Map<number, EvolutionSpecies>(
    speciesList.map((s: EvolutionSpecies) => [s.id, s]),
  );

  for (const species of speciesList) {
    if (!species.evolves_from_species_id) continue;

    const fromSpecies = speciesMap.get(species.evolves_from_species_id);
    if (!fromSpecies) continue;

    // Get sprites
    const fromSprites = pokemonGraphQLService.parseSprites(
      fromSpecies.pokemons[0]?.pokemonsprites[0]?.sprites,
    );
    const toSprites = pokemonGraphQLService.parseSprites(
      species.pokemons[0]?.pokemonsprites[0]?.sprites,
    );

    // Process evolution details
    for (const evoDetail of species.pokemonevolutions) {
      const triggerData: EvolutionItem["trigger"] = {
        text: "",
      };
      const textParts: string[] = [];

      // Basic trigger type
      if (evoDetail.evolutiontrigger) {
        triggerData.type = evoDetail.evolutiontrigger.name;
      }

      // Level requirement
      if (evoDetail.min_level) {
        triggerData.minLevel = evoDetail.min_level;
        textParts.push(`Level ${evoDetail.min_level}`);
      }

      // Evolution item
      if (evoDetail.item) {
        triggerData.item = evoDetail.item.name;
        textParts.push(`Use ${evoDetail.item.name.replace(/-/g, " ")}`);
      }

      // Held item during trade
      if (evoDetail.held_item_id) {
        const heldItemName = heldItemMap.get(evoDetail.held_item_id);
        if (heldItemName) {
          triggerData.heldItem = heldItemName;
          textParts.push(`Trade Holding ${heldItemName.replace(/-/g, " ")}`);
        } else {
          textParts.push("Trade holding item");
        }
      }

      // Trade trigger
      if (
        evoDetail.evolutiontrigger?.name === "trade" &&
        !evoDetail.held_item_id &&
        !evoDetail.trade_species_id
      ) {
        textParts.push("Trade");
      }

      // Trade for specific Pokemon
      if (evoDetail.trade_species_id) {
        triggerData.tradeSpeciesId = evoDetail.trade_species_id;
        textParts.push(`Trade for specific Pokémon`);
      }

      // Happiness requirement
      if (evoDetail.min_happiness) {
        triggerData.minHappiness = evoDetail.min_happiness;
        textParts.push(`Happiness ${evoDetail.min_happiness}+`);
      }

      // Beauty requirement
      if (evoDetail.min_beauty) {
        triggerData.minBeauty = evoDetail.min_beauty;
        textParts.push(`Beauty ${evoDetail.min_beauty}+`);
      }

      // Affection requirement
      if (evoDetail.min_affection) {
        triggerData.minAffection = evoDetail.min_affection;
        textParts.push(`Affection ${evoDetail.min_affection}+`);
      }

      // Time of day
      if (evoDetail.time_of_day) {
        triggerData.timeOfDay = evoDetail.time_of_day;
        textParts.push(evoDetail.time_of_day);
      }

      // Location
      if (evoDetail.location) {
        triggerData.location = evoDetail.location.name;
        textParts.push(`at ${evoDetail.location.name.replace(/-/g, " ")}`);
      }

      // Known move
      if (evoDetail.move) {
        triggerData.knownMove = evoDetail.move.name;
        textParts.push(`knowing ${evoDetail.move.name.replace(/-/g, " ")}`);
      }

      // Known move type
      if (evoDetail.type) {
        triggerData.knownMoveType = evoDetail.type.name;
        textParts.push(`knowing ${evoDetail.type.name}-type move`);
      }

      // Gender requirement
      if (evoDetail.gender_id !== null && evoDetail.gender_id !== undefined) {
        triggerData.gender = evoDetail.gender_id;
        const genderText = evoDetail.gender_id === 1 ? "Female" : "Male";
        textParts.push(genderText);
      }

      // Rain requirement
      if (evoDetail.needs_overworld_rain) {
        triggerData.needsOverworldRain = true;
        textParts.push("in rain");
      }

      // Turn upside down
      if (evoDetail.turn_upside_down) {
        triggerData.turnUpsideDown = true;
        textParts.push("upside down");
      }

      // Physical stats comparison
      if (
        evoDetail.relative_physical_stats !== null &&
        evoDetail.relative_physical_stats !== undefined
      ) {
        triggerData.relativePhysicalStats = evoDetail.relative_physical_stats;
        if (evoDetail.relative_physical_stats === 1) {
          textParts.push("Atk > Def");
        } else if (evoDetail.relative_physical_stats === -1) {
          textParts.push("Def > Atk");
        } else {
          textParts.push("Atk = Def");
        }
      }

      triggerData.text = textParts.join(", ");

      evolutions.push({
        from: {
          id: fromSpecies.pokemons[0]?.id || fromSpecies.id,
          name: fromSpecies.name,
          sprite: fromSprites?.front_default || "",
        },
        to: {
          id: species.pokemons[0]?.id || species.id,
          name: species.name,
          sprite: toSprites?.front_default || "",
        },
        trigger: textParts.length > 0 ? triggerData : undefined,
      });
    }

    // If no evolution details, still add the evolution
    if (species.pokemonevolutions.length === 0) {
      evolutions.push({
        from: {
          id: fromSpecies.pokemons[0]?.id || fromSpecies.id,
          name: fromSpecies.name,
          sprite: fromSprites?.front_default || "",
        },
        to: {
          id: species.pokemons[0]?.id || species.id,
          name: species.name,
          sprite: toSprites?.front_default || "",
        },
      });
    }
  }

  return evolutions;
}

/**
 * Lazy-loaded evolution chain hook
 * Only fetches when enabled is true (e.g., when Evolution tab is active)
 */
export function usePokemonEvolution(
  evolutionChainId: number | null,
  enabled: boolean = true,
) {
  const evolutionQuery = useQuery({
    queryKey: ["pokemon", "evolution", evolutionChainId],
    queryFn: async () => {
      if (!evolutionChainId) return null;
      const chainData =
        await pokemonGraphQLService.getEvolutionChain(evolutionChainId);
      if (!chainData) return [];
      return processEvolutionChain(chainData);
    },
    enabled: !!evolutionChainId && enabled,
  });

  // Memoize the evolution chain data
  const evolutionChain = useMemo(() => {
    return evolutionQuery.data ?? [];
  }, [evolutionQuery.data]);

  return {
    evolutionQuery,
    evolutionChain,
    isLoading: evolutionQuery.isLoading,
    isError: evolutionQuery.isError,
    error: evolutionQuery.error,
  };
}
