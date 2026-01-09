/**
 * @deprecated This hook is deprecated. Use the TanStack Query-based hooks instead:
 * - usePokemonCore: For Pokemon detail and species data
 * - usePokemonEvolution: For lazy-loaded evolution chain data
 * - useRelatedPokemon: For lazy-loaded related Pokemon data
 *
 * Import from: import { usePokemonCore, usePokemonEvolution, useRelatedPokemon } from "../hooks/queries";
 *
 * Benefits of new hooks:
 * - Parallel data fetching (faster initial load)
 * - Lazy loading for evolution and related Pokemon (smaller initial payload)
 * - React-aware caching (instant back navigation)
 * - Automatic cache invalidation
 */
import { useState, useCallback } from "react";
import {
  pokemonGraphQLService,
  PokemonDetailGraphQL,
  PokemonSpeciesGraphQL,
  EvolutionChainGraphQL,
  RelatedPokemonGraphQL,
  PokemonTypeSlot,
  PokemonMove,
  PokemonStat,
  PokemonAbility,
  PokemonHeldItem,
} from "../services/pokemon/pokemon-graphql.service";

// Enhanced move details for UI display
export interface MoveDetailData {
  name: string;
  localizedName: string;
  type: string;
  power: number | null;
  accuracy: number | null;
  pp: number | null;
  priority: number;
  damageClass: "physical" | "special" | "status";
  learnMethod: string;
  level: number | null;
  generation: number | null;
  description: string | null;
  meta: {
    critRate: number;
    drain: number;
    flinchChance: number;
    healing: number;
    minHits: number | null;
    maxHits: number | null;
  } | null;
}
import {
  EvolutionItem,
  PokemonSprites,
  RelatedPokemonItem,
  PokemonForm,
} from "../types/pokemon.d";
import { IPokemonDetailResponse, IPokemonSpecies } from "../types/pokemon.d";
import { POKEMON_IMAGE } from "../config/api.config";

// Language ID constants for future i18n support
export const LANGUAGE_IDS = {
  JAPANESE: 1,
  ROOMAJI: 2,
  KOREAN: 3,
  CHINESE_TRADITIONAL: 4,
  FRENCH: 5,
  GERMAN: 6,
  SPANISH: 7,
  ITALIAN: 8,
  ENGLISH: 9,
  CZECH: 10,
  JAPANESE_KANJI: 11,
  CHINESE_SIMPLIFIED: 12,
} as const;

export type LanguageId = (typeof LANGUAGE_IDS)[keyof typeof LANGUAGE_IDS];

/** Generate fallback sprite URLs from Pokemon ID when GraphQL data is missing */
const generateFallbackSprites = (id: number): PokemonSprites => {
  const base = POKEMON_IMAGE.replace(/\/$/, "");
  const animated = `${base}/versions/generation-v/black-white/animated`;

  return {
    front_default: `${base}/${id}.png`,
    back_default: `${base}/back/${id}.png`,
    front_shiny: `${base}/shiny/${id}.png`,
    back_shiny: `${base}/back/shiny/${id}.png`,
    front_female: null,
    front_shiny_female: null,
    back_female: null,
    back_shiny_female: null,
    versions: {
      "generation-v": {
        "black-white": {
          animated: {
            front_default: `${animated}/${id}.gif`,
            back_default: `${animated}/back/${id}.gif`,
            front_shiny: `${animated}/shiny/${id}.gif`,
            back_shiny: `${animated}/back/shiny/${id}.gif`,
            front_female: null,
            front_shiny_female: null,
            back_female: null,
            back_shiny_female: null,
          },
        },
      },
    },
  };
};

interface UsePokemonGraphQLResult {
  // Data states
  pokemonId: number;
  types: string[];
  typeNames: string[]; // English type names for color mapping
  moves: string[];
  moveDetails: MoveDetailData[]; // Full move data for enhanced UI
  stats: IPokemonDetailResponse["stats"];
  abilities: IPokemonDetailResponse["abilities"];
  sprite: string;
  sprites: PokemonSprites;
  height: number;
  weight: number;
  baseExperience: number;
  heldItems: IPokemonDetailResponse["held_items"];
  specialForms: PokemonForm[];
  species: IPokemonSpecies | null;
  evolutionChain: EvolutionItem[];
  relatedPokemon: RelatedPokemonItem[];

  // Species-specific data
  captureRate: number;
  baseHappiness: number;
  flavorText: string;
  varieties: IPokemonSpecies["varieties"];
  eggGroups: string[];
  habitat: string;
  growthRate: string;
  generation: string;
  generationId: number;
  isLegendary: boolean;
  isMythical: boolean;
  shape: string;
  color: string;
  hatchCounter: number;
  genderRate: number;

  // Loading states
  isLoading: boolean;
  isLoadingEvolution: boolean;
  isLoadingRelated: boolean;

  // Methods
  loadPokemon: (name: string, languageId?: LanguageId) => Promise<void>;
  loadSpeciesData: (
    speciesId: number,
    languageId?: LanguageId,
  ) => Promise<void>;
  loadRelatedPokemon: (
    generationId: number,
    excludeName: string,
    languageId?: LanguageId,
  ) => Promise<void>;
}

/**
 * Hook to fetch Pokemon data using GraphQL
 * Supports multi-language through languageId parameter
 *
 * @deprecated Use usePokemonCore, usePokemonEvolution, and useRelatedPokemon from hooks/queries instead.
 * This hook loads all data sequentially. The new hooks provide:
 * - Parallel loading for faster initial render
 * - Lazy loading for evolution and related Pokemon
 * - React-aware caching with TanStack Query
 */
export function usePokemonGraphQL(): UsePokemonGraphQLResult {
  // Pokemon detail states
  const [pokemonId, setPokemonId] = useState<number>(0);
  const [types, setTypes] = useState<string[]>([]);
  const [typeNames, setTypeNames] = useState<string[]>([]); // English names for color
  const [moves, setMoves] = useState<string[]>([]);
  const [moveDetails, setMoveDetails] = useState<MoveDetailData[]>([]);
  const [stats, setStats] = useState<IPokemonDetailResponse["stats"]>([]);
  const [abilities, setAbilities] = useState<
    IPokemonDetailResponse["abilities"]
  >([]);
  const [sprite, setSprite] = useState<string>("");
  const [sprites, setSprites] = useState<PokemonSprites>({ front_default: "" });
  const [height, setHeight] = useState<number>(0);
  const [weight, setWeight] = useState<number>(0);
  const [baseExperience, setBaseExperience] = useState<number>(0);
  const [heldItems, setHeldItems] = useState<
    IPokemonDetailResponse["held_items"]
  >([]);
  const [specialForms, setSpecialForms] = useState<PokemonForm[]>([]);

  // Species states
  const [species, setSpecies] = useState<IPokemonSpecies | null>(null);
  const [captureRate, setCaptureRate] = useState<number>(0);
  const [baseHappiness, setBaseHappiness] = useState<number>(0);
  const [flavorText, setFlavorText] = useState<string>("");
  const [varieties, setVarieties] = useState<IPokemonSpecies["varieties"]>([]);
  const [eggGroups, setEggGroups] = useState<string[]>([]);
  const [habitat, setHabitat] = useState<string>("");
  const [growthRate, setGrowthRate] = useState<string>("");
  const [generation, setGeneration] = useState<string>("");
  const [generationId, setGenerationId] = useState<number>(0);
  const [isLegendary, setIsLegendary] = useState<boolean>(false);
  const [isMythical, setIsMythical] = useState<boolean>(false);
  const [shape, setShape] = useState<string>("");
  const [color, setColor] = useState<string>("");
  const [hatchCounter, setHatchCounter] = useState<number>(0);
  const [genderRate, setGenderRate] = useState<number>(-1);

  // Evolution and related
  const [evolutionChain, setEvolutionChain] = useState<EvolutionItem[]>([]);
  const [relatedPokemon, setRelatedPokemon] = useState<RelatedPokemonItem[]>(
    [],
  );

  // Loading states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingEvolution, setIsLoadingEvolution] = useState<boolean>(false);
  const [isLoadingRelated, setIsLoadingRelated] = useState<boolean>(false);

  const transformPokemonDetail = useCallback(
    (
      data: PokemonDetailGraphQL,
      languageId: LanguageId = LANGUAGE_IDS.ENGLISH,
    ) => {
      const parsed = pokemonGraphQLService.parseSprites(
        data.pokemonsprites[0]?.sprites,
      );
      const spritesData = parsed?.front_default
        ? parsed
        : generateFallbackSprites(data.id);

      const transformedTypes = data.pokemontypes.map((t: PokemonTypeSlot) => {
        const localizedName = pokemonGraphQLService.getLocalizedName(
          t.type.typenames,
          languageId,
        );
        return localizedName || t.type.name;
      });

      const englishTypeNames = data.pokemontypes.map(
        (t: PokemonTypeSlot) => t.type.name,
      );

      const transformedMoves = data.pokemonmoves.map((m: PokemonMove) => {
        const localizedName = pokemonGraphQLService.getLocalizedName(
          m.move.movenames,
          languageId,
        );
        return localizedName || m.move.name;
      });

      // Get damage class from API (Gen 4+ physical/special split)
      // Since Gen 4, each move has its own damage class independent of type
      const getDamageClass = (
        move: PokemonMove,
      ): "physical" | "special" | "status" => {
        // Use API data if available
        const damageClassName = move.move.movedamageclass?.name?.toLowerCase();
        if (damageClassName === "physical") return "physical";
        if (damageClassName === "special") return "special";
        if (damageClassName === "status") return "status";

        if (!move.move.power || move.move.power === 0) {
          return "status";
        }

        // If API data missing and move has power, default to physical
        // Note: This is a fallback only - actual damage class should come from API
        return "physical";
      };

      // Determine learn method based on level
      const getLearnMethod = (move: PokemonMove): string => {
        if (move.level && move.level > 0) {
          return "level-up";
        }
        return "machine"; // Default for level-0 moves
      };

      // Get meta data
      const getMeta = (move: PokemonMove) => {
        const meta = move.move.movemeta?.[0];
        if (!meta) return null;
        return {
          critRate: meta.crit_rate || 0,
          drain: meta.drain || 0,
          flinchChance: meta.flinch_chance || 0,
          healing: meta.healing || 0,
          minHits: meta.min_hits,
          maxHits: meta.max_hits,
        };
      };

      // Get flavor text description
      const getDescription = (move: PokemonMove): string | null => {
        const flavorText = move.move.moveflavortexts?.[0]?.flavor_text;
        if (!flavorText) return null;
        // Clean up the text (remove line breaks and extra spaces)
        return flavorText
          .replace(/\f/g, " ")
          .replace(/\n/g, " ")
          .replace(/\s+/g, " ")
          .trim();
      };

      // Create detailed move data for enhanced UI
      const transformedMoveDetails: MoveDetailData[] = data.pokemonmoves.map(
        (m: PokemonMove) => ({
          name: m.move.name,
          localizedName:
            pokemonGraphQLService.getLocalizedName(
              m.move.movenames,
              languageId,
            ) || m.move.name,
          type: m.move.type?.name || "normal",
          power: m.move.power,
          accuracy: m.move.accuracy,
          pp: m.move.pp,
          priority: m.move.priority || 0,
          damageClass: getDamageClass(m),
          learnMethod: getLearnMethod(m),
          level: m.level || null,
          generation: m.move.generation?.id || null,
          description: getDescription(m),
          meta: getMeta(m),
        }),
      );

      const transformedStats: IPokemonDetailResponse["stats"] =
        data.pokemonstats.map((s: PokemonStat) => ({
          base_stat: s.base_stat,
          effort: s.effort,
          stat: {
            name: s.stat.name,
            url: "",
          },
        }));

      const transformedAbilities: IPokemonDetailResponse["abilities"] =
        data.pokemonabilities.map((a: PokemonAbility) => ({
          ability: {
            name:
              pokemonGraphQLService.getLocalizedName(
                a.ability.abilitynames,
                languageId,
              ) || a.ability.name,
            url: "",
          },
          is_hidden: a.is_hidden,
          slot: a.slot,
        }));

      const transformedHeldItems: IPokemonDetailResponse["held_items"] = [];
      const heldItemsMap = new Map<
        string,
        IPokemonDetailResponse["held_items"][0]
      >();

      data.pokemonhelditemsByPokemonId.forEach((h: PokemonHeldItem) => {
        const itemName =
          pokemonGraphQLService.getLocalizedName(
            h.item.itemnames,
            languageId,
          ) || h.item.name;

        if (!heldItemsMap.has(itemName)) {
          heldItemsMap.set(itemName, {
            item: { name: h.item.name, url: "" },
            version_details: [],
          });
        }

        heldItemsMap.get(itemName)!.version_details.push({
          rarity: h.rarity,
          version: { name: h.version.name, url: "" },
        });
      });

      heldItemsMap.forEach((value) => transformedHeldItems.push(value));

      const transformedForms: PokemonForm[] = data.pokemonforms.map(
        (f: {
          id: number;
          name: string;
          is_default: boolean;
          pokemonformnames: Array<{ name: string; language_id: number }>;
        }) => ({
          name:
            pokemonGraphQLService.getLocalizedName(
              f.pokemonformnames,
              languageId,
            ) || f.name,
          url: "",
          id: f.id,
          is_default: f.is_default,
        }),
      );

      const spriteUrl = `${POKEMON_IMAGE}/versions/generation-v/black-white/animated/${data.id}.gif`;

      return {
        pokemonId: data.id,
        types: transformedTypes,
        typeNames: englishTypeNames,
        moves: transformedMoves,
        moveDetails: transformedMoveDetails,
        stats: transformedStats,
        abilities: transformedAbilities,
        sprite: spriteUrl,
        sprites: spritesData as PokemonSprites,
        height: data.height,
        weight: data.weight,
        baseExperience: data.base_experience,
        heldItems: transformedHeldItems,
        specialForms: transformedForms.length > 1 ? transformedForms : [],
        speciesId: data.pokemonspecy.id,
        generationId: data.pokemonspecy.generation.id,
      };
    },
    [],
  );

  /**
   * Transform GraphQL species data
   */
  const transformSpeciesData = useCallback(
    (
      data: PokemonSpeciesGraphQL,
      languageId: LanguageId = LANGUAGE_IDS.ENGLISH,
    ) => {
      type FlavorTextEntry = {
        flavor_text: string;
        language_id: number;
        version: { name: string };
      };

      type EggGroupEntry = {
        egggroup: {
          name: string;
          id: number;
          egggroupnames: Array<{ name: string; language_id: number }>;
        };
      };

      type PokemonVariety = {
        id: number;
        name: string;
        is_default: boolean;
      };

      type SpeciesName = {
        name: string;
        genus: string;
        language_id: number;
      };

      const flavorTexts = data.pokemonspeciesflavortexts.filter(
        (f: FlavorTextEntry) => f.language_id === languageId,
      );
      const randomFlavorText =
        flavorTexts.length > 0
          ? pokemonGraphQLService.formatFlavorText(
              flavorTexts[Math.floor(Math.random() * flavorTexts.length)]
                .flavor_text,
            )
          : "";

      const eggGroupNames = data.pokemonegggroups.map(
        (eg: EggGroupEntry) =>
          pokemonGraphQLService.getLocalizedName(
            eg.egggroup.egggroupnames,
            languageId,
          ) || eg.egggroup.name,
      );

      const transformedVarieties: IPokemonSpecies["varieties"] =
        data.pokemons.map((p: PokemonVariety) => ({
          is_default: p.is_default,
          pokemon: { name: p.name, url: "" },
        }));

      const speciesObj: IPokemonSpecies = {
        id: data.id,
        name: data.name,
        order: data.order,
        gender_rate: data.gender_rate,
        capture_rate: data.capture_rate,
        base_happiness: data.base_happiness,
        is_baby: data.is_baby,
        is_legendary: data.is_legendary,
        is_mythical: data.is_mythical,
        hatch_counter: data.hatch_counter,
        has_gender_differences: data.has_gender_differences,
        forms_switchable: data.forms_switchable,
        growth_rate: { name: data.growthrate.name, url: "" },
        pokedex_numbers: [],
        egg_groups: data.pokemonegggroups.map((eg: EggGroupEntry) => ({
          name: eg.egggroup.name,
          url: "",
        })),
        color: { name: data.pokemoncolor.name, url: "" },
        shape: data.pokemonshape
          ? { name: data.pokemonshape.name, url: "" }
          : { name: "", url: "" },
        evolves_from_species: null,
        evolution_chain: { url: "" },
        habitat: data.pokemonhabitat
          ? { name: data.pokemonhabitat.name, url: "" }
          : null,
        generation: {
          name: data.generation.name,
          url: `https://pokeapi.co/api/v2/generation/${data.generation.id}/`,
        },
        names: data.pokemonspeciesnames.map((n: SpeciesName) => ({
          name: n.name,
          language: { name: "", url: "" },
        })),
        flavor_text_entries: data.pokemonspeciesflavortexts.map(
          (f: FlavorTextEntry) => ({
            flavor_text: f.flavor_text,
            language: { name: "", url: "" },
            version: { name: f.version.name, url: "" },
          }),
        ),
        form_descriptions: [],
        genera: data.pokemonspeciesnames.map((n: SpeciesName) => ({
          genus: n.genus,
          language: {
            name:
              n.language_id === 9
                ? "en"
                : n.language_id === 1
                  ? "ja"
                  : String(n.language_id),
            url: "",
          },
        })),
        varieties: transformedVarieties,
      };

      return {
        species: speciesObj,
        captureRate: data.capture_rate,
        baseHappiness: data.base_happiness,
        flavorText: randomFlavorText,
        varieties: transformedVarieties,
        eggGroups: eggGroupNames,
        habitat: data.pokemonhabitat?.name || "",
        growthRate: data.growthrate.name,
        generation: data.generation.name,
        generationId: data.generation.id,
        isLegendary: data.is_legendary,
        isMythical: data.is_mythical,
        shape: data.pokemonshape?.name || "",
        color: data.pokemoncolor.name,
        hatchCounter: data.hatch_counter,
        genderRate: data.gender_rate,
        evolutionChainId: data.evolution_chain_id,
      };
    },
    [],
  );

  /**
   * Process evolution chain from GraphQL data
   */
  const processEvolutionChain = useCallback(
    async (chainData: EvolutionChainGraphQL): Promise<EvolutionItem[]> => {
      const evolutions: EvolutionItem[] = [];
      const speciesList = chainData.pokemonspecies;

      // Define the type for species in the evolution chain
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
      const heldItemMap =
        await pokemonGraphQLService.getItemsByIds(heldItemIds);

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
              textParts.push(
                `Trade Holding ${heldItemName.replace(/-/g, " ")}`,
              );
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

          // Trade for specific Pokemon (using trade_species_id)
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
          if (
            evoDetail.gender_id !== null &&
            evoDetail.gender_id !== undefined
          ) {
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
            triggerData.relativePhysicalStats =
              evoDetail.relative_physical_stats;
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
    },
    [],
  );

  /**
   * Load related Pokemon by generation
   */
  const loadRelatedPokemon = useCallback(
    async (
      genId: number,
      excludeName: string,
      languageId: LanguageId = LANGUAGE_IDS.ENGLISH,
    ) => {
      if (!genId) return;

      try {
        setIsLoadingRelated(true);

        const relatedData =
          await pokemonGraphQLService.getRelatedPokemonByGeneration(
            genId,
            excludeName,
            6,
            languageId,
          );

        const transformedRelated: RelatedPokemonItem[] = relatedData.map(
          (p: RelatedPokemonGraphQL) => {
            const sprites = pokemonGraphQLService.parseSprites(
              p.pokemons[0]?.pokemonsprites[0]?.sprites,
            );

            return {
              name:
                pokemonGraphQLService.getLocalizedName(
                  p.pokemonspeciesnames,
                  languageId,
                ) || p.name,
              url: "",
              id: p.pokemons[0]?.id || p.id,
              sprite: sprites?.front_default || undefined,
            };
          },
        );

        setRelatedPokemon(transformedRelated);
        setIsLoadingRelated(false);
      } catch (error) {
        console.error("Error loading related Pokemon:", error);
        setIsLoadingRelated(false);
      }
    },
    [],
  );

  /**
   * Load species data by species ID
   */
  const loadSpeciesData = useCallback(
    async (
      speciesId: number,
      languageId: LanguageId = LANGUAGE_IDS.ENGLISH,
    ) => {
      if (!speciesId) return;

      try {
        setIsLoadingEvolution(true);

        const speciesData = await pokemonGraphQLService.getPokemonSpecies(
          speciesId,
          languageId,
        );

        if (!speciesData) {
          setIsLoadingEvolution(false);
          return;
        }

        const transformed = transformSpeciesData(speciesData, languageId);

        setSpecies(transformed.species);
        setCaptureRate(transformed.captureRate);
        setBaseHappiness(transformed.baseHappiness);
        setFlavorText(transformed.flavorText);
        setVarieties(transformed.varieties);
        setEggGroups(transformed.eggGroups);
        setHabitat(transformed.habitat);
        setGrowthRate(transformed.growthRate);
        setGeneration(transformed.generation);
        setGenerationId(transformed.generationId);
        setIsLegendary(transformed.isLegendary);
        setIsMythical(transformed.isMythical);
        setShape(transformed.shape);
        setColor(transformed.color);
        setHatchCounter(transformed.hatchCounter);
        setGenderRate(transformed.genderRate);

        // Load evolution chain
        if (transformed.evolutionChainId) {
          const chainData = await pokemonGraphQLService.getEvolutionChain(
            transformed.evolutionChainId,
          );

          if (chainData) {
            const processedEvolutions = await processEvolutionChain(chainData);
            setEvolutionChain(processedEvolutions);
          }
        }

        // Load related Pokemon
        if (transformed.generationId) {
          await loadRelatedPokemon(
            transformed.generationId,
            speciesData.name,
            languageId,
          );
        }

        setIsLoadingEvolution(false);
      } catch (error) {
        console.error("Error loading species data:", error);
        setIsLoadingEvolution(false);
      }
    },
    [transformSpeciesData, processEvolutionChain, loadRelatedPokemon],
  );

  /**
   * Load Pokemon detail by name
   */
  const loadPokemon = useCallback(
    async (name: string, languageId: LanguageId = LANGUAGE_IDS.ENGLISH) => {
      if (!name) return;

      try {
        setIsLoading(true);

        const response = await pokemonGraphQLService.getPokemonDetail(
          name,
          languageId,
        );

        if (!response) {
          throw new Error("Pokemon not found");
        }

        const transformed = transformPokemonDetail(response, languageId);

        setPokemonId(transformed.pokemonId);
        setTypes(transformed.types);
        setTypeNames(transformed.typeNames);
        setMoves(transformed.moves);
        setMoveDetails(transformed.moveDetails);
        setStats(transformed.stats);
        setAbilities(transformed.abilities);
        setSprite(transformed.sprite);
        setSprites(transformed.sprites);
        setHeight(transformed.height);
        setWeight(transformed.weight);
        setBaseExperience(transformed.baseExperience);
        setHeldItems(transformed.heldItems);
        setSpecialForms(transformed.specialForms);

        // Load species data
        await loadSpeciesData(transformed.speciesId, languageId);

        setIsLoading(false);
      } catch (error) {
        console.error("Error loading Pokemon:", error);
        setIsLoading(false);
        throw error;
      }
    },
    [transformPokemonDetail, loadSpeciesData],
  );

  return {
    // Data states
    pokemonId,
    types,
    typeNames,
    moves,
    moveDetails,
    stats,
    abilities,
    sprite,
    sprites,
    height,
    weight,
    baseExperience,
    heldItems,
    specialForms,
    species,
    evolutionChain,
    relatedPokemon,

    // Species-specific data
    captureRate,
    baseHappiness,
    flavorText,
    varieties,
    eggGroups,
    habitat,
    growthRate,
    generation,
    generationId,
    isLegendary,
    isMythical,
    shape,
    color,
    hatchCounter,
    genderRate,

    // Loading states
    isLoading,
    isLoadingEvolution,
    isLoadingRelated,

    // Methods
    loadPokemon,
    loadSpeciesData,
    loadRelatedPokemon,
  };
}
