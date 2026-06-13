const typeEffectiveness: Record<
  string,
  { weakTo: string[]; resistantTo: string[]; immuneTo: string[] }
> = {
  normal: { weakTo: ["fighting"], resistantTo: [], immuneTo: ["ghost"] },
  fire: {
    weakTo: ["water", "ground", "rock"],
    resistantTo: ["fire", "grass", "ice", "bug", "steel", "fairy"],
    immuneTo: [],
  },
  water: {
    weakTo: ["electric", "grass"],
    resistantTo: ["fire", "water", "ice", "steel"],
    immuneTo: [],
  },
  electric: {
    weakTo: ["ground"],
    resistantTo: ["electric", "flying", "steel"],
    immuneTo: [],
  },
  grass: {
    weakTo: ["fire", "ice", "poison", "flying", "bug"],
    resistantTo: ["water", "electric", "grass", "ground"],
    immuneTo: [],
  },
  ice: {
    weakTo: ["fire", "fighting", "rock", "steel"],
    resistantTo: ["ice"],
    immuneTo: [],
  },
  fighting: {
    weakTo: ["flying", "psychic", "fairy"],
    resistantTo: ["bug", "rock", "dark"],
    immuneTo: [],
  },
  poison: {
    weakTo: ["ground", "psychic"],
    resistantTo: ["grass", "fighting", "poison", "bug", "fairy"],
    immuneTo: [],
  },
  ground: {
    weakTo: ["water", "grass", "ice"],
    resistantTo: ["poison", "rock"],
    immuneTo: ["electric"],
  },
  flying: {
    weakTo: ["electric", "ice", "rock"],
    resistantTo: ["grass", "fighting", "bug"],
    immuneTo: ["ground"],
  },
  psychic: {
    weakTo: ["bug", "ghost", "dark"],
    resistantTo: ["fighting", "psychic"],
    immuneTo: [],
  },
  bug: {
    weakTo: ["fire", "flying", "rock"],
    resistantTo: ["grass", "fighting", "ground"],
    immuneTo: [],
  },
  rock: {
    weakTo: ["water", "grass", "fighting", "ground", "steel"],
    resistantTo: ["normal", "fire", "poison", "flying"],
    immuneTo: [],
  },
  ghost: {
    weakTo: ["ghost", "dark"],
    resistantTo: ["poison", "bug"],
    immuneTo: ["normal", "fighting"],
  },
  dragon: {
    weakTo: ["ice", "dragon", "fairy"],
    resistantTo: ["fire", "water", "electric", "grass"],
    immuneTo: [],
  },
  dark: {
    weakTo: ["fighting", "bug", "fairy"],
    resistantTo: ["ghost", "dark"],
    immuneTo: ["psychic"],
  },
  steel: {
    weakTo: ["fire", "fighting", "ground"],
    resistantTo: [
      "normal",
      "grass",
      "ice",
      "flying",
      "psychic",
      "bug",
      "rock",
      "dragon",
      "steel",
      "fairy",
    ],
    immuneTo: ["poison"],
  },
  fairy: {
    weakTo: ["poison", "steel"],
    resistantTo: ["fighting", "bug", "dark"],
    immuneTo: ["dragon"],
  },
};

export const getTypeEffectiveness = (
  moveType: string,
  defenderTypes: string[],
): number => {
  const normalizedMove = moveType.toLowerCase();
  let multiplier = 1.0;

  for (const defType of defenderTypes) {
    const normalizedDef = defType.toLowerCase();
    const relation = typeEffectiveness[normalizedDef];
    if (!relation) continue;

    if (relation.weakTo.includes(normalizedMove)) {
      multiplier *= 2.0;
    } else if (relation.resistantTo.includes(normalizedMove)) {
      multiplier *= 0.5;
    } else if (relation.immuneTo.includes(normalizedMove)) {
      multiplier *= 0.0;
    }
  }

  return multiplier;
};

export const randomNumber = (): number => {
  return Math.floor(Math.random() * 1000000);
};
