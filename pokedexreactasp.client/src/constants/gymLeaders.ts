export interface IGymPokemon {
  name: string;
  sprite: string;
  sprite_back?: string;
  types: string[];
  level: number;
  base_experience: number;
  stats: {
    hp: number;
    attack: number;
    defense: number;
    special_attack: number;
    special_defense: number;
    speed: number;
  };
  moves: Array<{
    name: string;
    power: number;
    type: string;
  }>;
  current_hp?: number;
  is_defeated?: boolean;
}

export interface IGymLeader {
  id: string; // matches achievementId, e.g., 'kanto_badge_brock'
  name: string;
  badgeName: string;
  region: string;
  avatar: string; // Leader avatar URL
  sprite: string; // Leader full sprite or battle image
  roster: IGymPokemon[];
}

export const GYM_LEADERS: Record<string, IGymLeader> = {};

// Fallback generator for unseeded gym leaders to ensure the game doesn't crash
export const getGymLeaderOrDefault = (id: string): IGymLeader => {
  if (GYM_LEADERS[id]) {
    return GYM_LEADERS[id];
  }

  // Create a default leader based on the ID structure
  // e.g. kanto_badge_brock -> Brock
  const parts = id.split("_");
  const region = parts[0]
    ? parts[0].charAt(0).toUpperCase() + parts[0].slice(1)
    : "Unknown";
  const nameRaw = parts[parts.length - 1] || "Gym Leader";
  const name = nameRaw.charAt(0).toUpperCase() + nameRaw.slice(1);

  return {
    id,
    name: `Gym Leader ${name}`,
    badgeName: `${name} Badge`,
    region,
    avatar: "https://play.pokemonshowdown.com/sprites/trainers/brock.png",
    sprite: "https://play.pokemonshowdown.com/sprites/trainers/brock.png",
    roster: [
      {
        name: "Pikachu",
        sprite:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
        types: ["electric"],
        level: 20,
        base_experience: 112,
        stats: {
          hp: 110,
          attack: 45,
          defense: 40,
          special_attack: 45,
          special_defense: 45,
          speed: 60,
        },
        moves: [
          { name: "Quick Attack", power: 40, type: "normal" },
          { name: "Thunderbolt", power: 90, type: "electric" },
        ],
      },
    ],
  };
};
