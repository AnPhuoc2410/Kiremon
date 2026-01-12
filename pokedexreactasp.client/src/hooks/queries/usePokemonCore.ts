import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import {
  pokemonGraphQLService,
  PokemonDetailGraphQL,
  PokemonSpeciesGraphQL,
  PokemonTypeSlot,
  PokemonMove,
  PokemonStat,
  PokemonAbility,
  PokemonHeldItem,
} from "../../services/pokemon/pokemon-graphql.service";
import { POKEMON_IMAGE } from "../../config/api.config";
import {
  PokemonSprites,
  PokemonForm,
  IPokemonDetailResponse,
  IPokemonSpecies,
} from "../../types/pokemon.d";

// Language ID constants
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

// Move detail data for UI display
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
    ailment: {
      name: string;
      chance: number | null;
    } | null;
  } | null;
  effectChance: number | null;
  statChanges: Array<{
    change: number;
    stat: string;
  }>;
}

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

// Transform functions
function transformPokemonDetail(
  data: PokemonDetailGraphQL,
  languageId: LanguageId = LANGUAGE_IDS.ENGLISH,
) {
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

  // Get damage class from API
  const getDamageClass = (
    move: PokemonMove,
  ): "physical" | "special" | "status" => {
    const damageClassName = move.move.movedamageclass?.name?.toLowerCase();
    if (damageClassName === "physical") return "physical";
    if (damageClassName === "special") return "special";
    if (damageClassName === "status") return "status";
    if (!move.move.power || move.move.power === 0) return "status";
    return "physical";
  };

  const getLearnMethod = (move: PokemonMove): string => {
    if (move.movelearnmethod?.name) {
      return move.movelearnmethod.name;
    }
    // Fallback if data is missing
    if (move.level && move.level > 0) return "level-up";
    return "machine";
  };

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
      ailment:
        meta.movemetaailment && meta.movemetaailment.name !== "none"
          ? {
              name: meta.movemetaailment.name,
              chance: meta.ailment_chance || move.move.move_effect_chance,
            }
          : null,
    };
  };

  const getStatChanges = (move: PokemonMove) => {
    return (
      move.move.movemetastatchanges?.map((sc) => ({
        change: sc.change,
        stat: sc.stat.name,
      })) || []
    );
  };

  const getDescription = (move: PokemonMove): string | null => {
    const flavorText = move.move.moveflavortexts?.[0]?.flavor_text;
    if (!flavorText) return null;
    return flavorText
      .replace(/\f/g, " ")
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  };

  const transformedMoveDetails: MoveDetailData[] = data.pokemonmoves.map(
    (m: PokemonMove) => ({
      name: m.move.name,
      localizedName:
        pokemonGraphQLService.getLocalizedName(m.move.movenames, languageId) ||
        m.move.name,
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
      effectChance: m.move.move_effect_chance,
      statChanges: getStatChanges(m),
    }),
  );

  const transformedStats: IPokemonDetailResponse["stats"] =
    data.pokemonstats.map((s: PokemonStat) => ({
      base_stat: s.base_stat,
      effort: s.effort,
      stat: { name: s.stat.name, url: "" },
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
      pokemonGraphQLService.getLocalizedName(h.item.itemnames, languageId) ||
      h.item.name;

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
}

function transformSpeciesData(
  data: PokemonSpeciesGraphQL,
  languageId: LanguageId = LANGUAGE_IDS.ENGLISH,
) {
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

  // Get localized Pokemon name
  const localizedNameEntry = data.pokemonspeciesnames.find(
    (n: SpeciesName) => n.language_id === languageId,
  );
  const localizedName = localizedNameEntry?.name || data.name;
  const localizedGenus = localizedNameEntry?.genus || "";

  const eggGroupNames = data.pokemonegggroups.map(
    (eg: EggGroupEntry) =>
      pokemonGraphQLService.getLocalizedName(
        eg.egggroup.egggroupnames,
        languageId,
      ) || eg.egggroup.name,
  );

  const transformedVarieties: IPokemonSpecies["varieties"] = data.pokemons.map(
    (p: PokemonVariety) => ({
      is_default: p.is_default,
      pokemon: { name: p.name, url: "" },
    }),
  );

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
    localizedName,
    localizedGenus,
  };
}

/**
 * Core Pokemon data hook using TanStack Query
 * Fetches detail and species data in parallel where possible
 */
export function usePokemonCore(
  name: string,
  languageId: LanguageId = LANGUAGE_IDS.ENGLISH,
) {
  // Query 1: Pokemon Detail - fetches immediately
  const detailQuery = useQuery({
    queryKey: ["pokemon", "detail", name, languageId],
    queryFn: () => pokemonGraphQLService.getPokemonDetail(name, languageId),
    enabled: !!name,
  });

  // Extract speciesId from detail data
  const speciesId = detailQuery.data?.pokemonspecy?.id;

  // Query 2: Species data - depends on speciesId from detail
  const speciesQuery = useQuery({
    queryKey: ["pokemon", "species", speciesId, languageId],
    queryFn: () =>
      pokemonGraphQLService.getPokemonSpecies(speciesId!, languageId),
    enabled: !!speciesId,
  });

  // Transform data using memoization
  const transformedDetail = useMemo(() => {
    if (!detailQuery.data) return null;
    return transformPokemonDetail(detailQuery.data, languageId);
  }, [detailQuery.data, languageId]);

  const transformedSpecies = useMemo(() => {
    if (!speciesQuery.data) return null;
    return transformSpeciesData(speciesQuery.data, languageId);
  }, [speciesQuery.data, languageId]);

  // Preload main sprite as soon as we have pokemonId
  useEffect(() => {
    if (transformedDetail?.pokemonId) {
      const img = new Image();
      img.src = `${POKEMON_IMAGE}/versions/generation-v/black-white/animated/${transformedDetail.pokemonId}.gif`;
    }
  }, [transformedDetail?.pokemonId]);

  // Combine loading states
  const isLoading = detailQuery.isLoading || speciesQuery.isLoading;
  const isDetailLoading = detailQuery.isLoading;
  const isSpeciesLoading = speciesQuery.isLoading;

  return {
    // Raw queries for advanced usage
    detailQuery,
    speciesQuery,

    // Transformed data
    detail: transformedDetail,
    species: transformedSpecies,

    // Convenience accessors from detail
    pokemonId: transformedDetail?.pokemonId ?? 0,
    types: transformedDetail?.types ?? [],
    typeNames: transformedDetail?.typeNames ?? [],
    moves: transformedDetail?.moves ?? [],
    moveDetails: transformedDetail?.moveDetails ?? [],
    stats: transformedDetail?.stats ?? [],
    abilities: transformedDetail?.abilities ?? [],
    sprite: transformedDetail?.sprite ?? "",
    sprites: transformedDetail?.sprites ?? { front_default: "" },
    height: transformedDetail?.height ?? 0,
    weight: transformedDetail?.weight ?? 0,
    baseExperience: transformedDetail?.baseExperience ?? 0,
    heldItems: transformedDetail?.heldItems ?? [],
    specialForms: transformedDetail?.specialForms ?? [],

    // Convenience accessors from species
    speciesData: transformedSpecies?.species ?? null,
    captureRate: transformedSpecies?.captureRate ?? 0,
    baseHappiness: transformedSpecies?.baseHappiness ?? 0,
    flavorText: transformedSpecies?.flavorText ?? "",
    varieties: transformedSpecies?.varieties ?? [],
    eggGroups: transformedSpecies?.eggGroups ?? [],
    habitat: transformedSpecies?.habitat ?? "",
    growthRate: transformedSpecies?.growthRate ?? "",
    generation: transformedSpecies?.generation ?? "",
    generationId: transformedSpecies?.generationId ?? 0,
    isLegendary: transformedSpecies?.isLegendary ?? false,
    isMythical: transformedSpecies?.isMythical ?? false,
    shape: transformedSpecies?.shape ?? "",
    color: transformedSpecies?.color ?? "",
    hatchCounter: transformedSpecies?.hatchCounter ?? 0,
    genderRate: transformedSpecies?.genderRate ?? -1,
    evolutionChainId: transformedSpecies?.evolutionChainId ?? null,
    localizedName: transformedSpecies?.localizedName ?? "",
    localizedGenus: transformedSpecies?.localizedGenus ?? "",

    // Loading states
    isLoading,
    isDetailLoading,
    isSpeciesLoading,
  };
}
