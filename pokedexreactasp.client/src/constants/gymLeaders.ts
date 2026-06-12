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

export const GYM_LEADERS: Record<string, IGymLeader> = {
  kanto_badge_brock: {
    id: "kanto_badge_brock",
    name: "Brock",
    badgeName: "Boulder Badge",
    region: "Kanto",
    avatar: "https://play.pokemonshowdown.com/sprites/trainers/brock.png",
    sprite: "https://play.pokemonshowdown.com/sprites/trainers/brock.png",
    roster: [
      {
        name: "Geodude",
        sprite:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/74.png",
        types: ["rock", "ground"],
        level: 12,
        base_experience: 60,
        stats: {
          hp: 80,
          attack: 30,
          defense: 35,
          special_attack: 15,
          special_defense: 15,
          speed: 12,
        },
        moves: [
          { name: "Tackle", power: 40, type: "normal" },
          { name: "Defense Curl", power: 0, type: "normal" },
          { name: "Rock Throw", power: 50, type: "rock" },
          { name: "Mud-Slap", power: 20, type: "ground" },
        ],
      },
      {
        name: "Onix",
        sprite:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/95.png",
        types: ["rock", "ground"],
        level: 14,
        base_experience: 77,
        stats: {
          hp: 95,
          attack: 32,
          defense: 45,
          special_attack: 18,
          special_defense: 20,
          speed: 24,
        },
        moves: [
          { name: "Tackle", power: 40, type: "normal" },
          { name: "Screech", power: 0, type: "normal" },
          { name: "Bind", power: 15, type: "normal" },
          { name: "Rock Tomb", power: 60, type: "rock" },
        ],
      },
    ],
  },
  kanto_badge_misty: {
    id: "kanto_badge_misty",
    name: "Misty",
    badgeName: "Cascade Badge",
    region: "Kanto",
    avatar: "https://play.pokemonshowdown.com/sprites/trainers/misty.png",
    sprite: "https://play.pokemonshowdown.com/sprites/trainers/misty.png",
    roster: [
      {
        name: "Staryu",
        sprite:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/120.png",
        types: ["water"],
        level: 18,
        base_experience: 68,
        stats: {
          hp: 90,
          attack: 35,
          defense: 38,
          special_attack: 42,
          special_defense: 38,
          speed: 45,
        },
        moves: [
          { name: "Tackle", power: 40, type: "normal" },
          { name: "Water Pulse", power: 60, type: "water" },
          { name: "Swift", power: 60, type: "normal" },
        ],
      },
      {
        name: "Starmie",
        sprite:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/121.png",
        types: ["water", "psychic"],
        level: 21,
        base_experience: 182,
        stats: {
          hp: 125,
          attack: 50,
          defense: 55,
          special_attack: 65,
          special_defense: 55,
          speed: 68,
        },
        moves: [
          { name: "Swift", power: 60, type: "normal" },
          { name: "Water Pulse", power: 60, type: "water" },
          { name: "Recover", power: 0, type: "normal" },
          { name: "Bubble Beam", power: 65, type: "water" },
        ],
      },
    ],
  },
  kanto_badge_lt_surge: {
    id: "kanto_badge_lt_surge",
    name: "Lt. Surge",
    badgeName: "Thunder Badge",
    region: "Kanto",
    avatar: "https://play.pokemonshowdown.com/sprites/trainers/ltsurge.png",
    sprite: "https://play.pokemonshowdown.com/sprites/trainers/ltsurge.png",
    roster: [
      {
        name: "Voltorb",
        sprite:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/100.png",
        types: ["electric"],
        level: 21,
        base_experience: 66,
        stats: {
          hp: 95,
          attack: 38,
          defense: 42,
          special_attack: 45,
          special_defense: 45,
          speed: 65,
        },
        moves: [
          { name: "Tackle", power: 40, type: "normal" },
          { name: "Spark", power: 65, type: "electric" },
        ],
      },
      {
        name: "Pikachu",
        sprite:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
        types: ["electric"],
        level: 21,
        base_experience: 112,
        stats: {
          hp: 92,
          attack: 45,
          defense: 38,
          special_attack: 42,
          special_defense: 38,
          speed: 62,
        },
        moves: [
          { name: "Quick Attack", power: 40, type: "normal" },
          { name: "Thunderbolt", power: 90, type: "electric" },
        ],
      },
      {
        name: "Raichu",
        sprite:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/26.png",
        types: ["electric"],
        level: 24,
        base_experience: 218,
        stats: {
          hp: 135,
          attack: 65,
          defense: 52,
          special_attack: 68,
          special_defense: 60,
          speed: 78,
        },
        moves: [
          { name: "Thunderbolt", power: 90, type: "electric" },
          { name: "Quick Attack", power: 40, type: "normal" },
          { name: "Double Kick", power: 30, type: "fighting" },
        ],
      },
    ],
  },
};

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
