import { POKEMON_IMAGE } from "@/config/api.config";

export const powerFromMoveName = (name: string): number => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return 30 + (hash % 36);
};

export const generateMovesForPokemon = (
  name: string,
  type1: string,
  type2: string | null,
) => {
  const t1 = type1.toLowerCase();
  const t2 = type2?.toLowerCase();

  const movePool: Record<
    string,
    Array<{ name: string; power: number; type: string }>
  > = {
    fire: [
      { name: "Ember", power: 40, type: "fire" },
      { name: "Flame Wheel", power: 60, type: "fire" },
      { name: "Flamethrower", power: 90, type: "fire" },
      { name: "Fire Blast", power: 110, type: "fire" },
    ],
    water: [
      { name: "Water Gun", power: 40, type: "water" },
      { name: "Water Pulse", power: 60, type: "water" },
      { name: "Surf", power: 90, type: "water" },
      { name: "Hydro Pump", power: 110, type: "water" },
    ],
    grass: [
      { name: "Vine Whip", power: 40, type: "grass" },
      { name: "Razor Leaf", power: 55, type: "grass" },
      { name: "Giga Drain", power: 75, type: "grass" },
      { name: "Solar Beam", power: 120, type: "grass" },
    ],
    electric: [
      { name: "Thunder Shock", power: 40, type: "electric" },
      { name: "Spark", power: 65, type: "electric" },
      { name: "Thunderbolt", power: 90, type: "electric" },
      { name: "Thunder", power: 110, type: "electric" },
    ],
    ice: [
      { name: "Powder Snow", power: 40, type: "ice" },
      { name: "Aurora Beam", power: 65, type: "ice" },
      { name: "Ice Beam", power: 90, type: "ice" },
      { name: "Blizzard", power: 110, type: "ice" },
    ],
    fighting: [
      { name: "Mach Punch", power: 40, type: "fighting" },
      { name: "Karate Chop", power: 50, type: "fighting" },
      { name: "Brick Break", power: 75, type: "fighting" },
      { name: "Close Combat", power: 120, type: "fighting" },
    ],
    poison: [
      { name: "Poison Sting", power: 30, type: "poison" },
      { name: "Acid", power: 40, type: "poison" },
      { name: "Sludge Bomb", power: 90, type: "poison" },
      { name: "Gunk Shot", power: 120, type: "poison" },
    ],
    ground: [
      { name: "Mud-Slap", power: 20, type: "ground" },
      { name: "Mud Shot", power: 55, type: "ground" },
      { name: "Dig", power: 80, type: "ground" },
      { name: "Earthquake", power: 100, type: "ground" },
    ],
    flying: [
      { name: "Gust", power: 40, type: "flying" },
      { name: "Wing Attack", power: 60, type: "flying" },
      { name: "Air Slash", power: 75, type: "flying" },
      { name: "Hurricane", power: 110, type: "flying" },
    ],
    psychic: [
      { name: "Confusion", power: 50, type: "psychic" },
      { name: "Psybeam", power: 65, type: "psychic" },
      { name: "Psychic", power: 90, type: "psychic" },
      { name: "Psystrike", power: 100, type: "psychic" },
    ],
    bug: [
      { name: "Struggle Bug", power: 50, type: "bug" },
      { name: "Bug Bite", power: 60, type: "bug" },
      { name: "Lunge", power: 80, type: "bug" },
      { name: "Megahorn", power: 120, type: "bug" },
    ],
    rock: [
      { name: "Rock Throw", power: 50, type: "rock" },
      { name: "Rock Tomb", power: 60, type: "rock" },
      { name: "Rock Slide", power: 75, type: "rock" },
      { name: "Stone Edge", power: 100, type: "rock" },
    ],
    ghost: [
      { name: "Lick", power: 30, type: "ghost" },
      { name: "Shadow Sneak", power: 40, type: "ghost" },
      { name: "Shadow Punch", power: 60, type: "ghost" },
      { name: "Shadow Ball", power: 80, type: "ghost" },
    ],
    dragon: [
      { name: "Dragon Breath", power: 60, type: "dragon" },
      { name: "Dragon Claw", power: 80, type: "dragon" },
      { name: "Dragon Pulse", power: 85, type: "dragon" },
      { name: "Outrage", power: 120, type: "dragon" },
    ],
    dark: [
      { name: "Bite", power: 60, type: "dark" },
      { name: "Foul Play", power: 95, type: "dark" },
      { name: "Dark Pulse", power: 80, type: "dark" },
      { name: "Night Slash", power: 70, type: "dark" },
    ],
    steel: [
      { name: "Metal Claw", power: 50, type: "steel" },
      { name: "Iron Head", power: 80, type: "steel" },
      { name: "Flash Cannon", power: 80, type: "steel" },
      { name: "Meteor Mash", power: 90, type: "steel" },
    ],
    fairy: [
      { name: "Fairy Wind", power: 40, type: "fairy" },
      { name: "Draining Kiss", power: 50, type: "fairy" },
      { name: "Dazzling Gleam", power: 80, type: "fairy" },
      { name: "Moonblast", power: 95, type: "fairy" },
    ],
    normal: [
      { name: "Tackle", power: 40, type: "normal" },
      { name: "Scratch", power: 40, type: "normal" },
      { name: "Slash", power: 70, type: "normal" },
      { name: "Hyper Beam", power: 150, type: "normal" },
    ],
  };

  const defaultNormal = [
    { name: "Tackle", power: 40, type: "normal" },
    { name: "Scratch", power: 40, type: "normal" },
    { name: "Slash", power: 70, type: "normal" },
    { name: "Hyper Beam", power: 150, type: "normal" },
  ];

  const moves1 = movePool[t1] || defaultNormal;
  const moves2 = t2 ? movePool[t2] || defaultNormal : [];

  return [
    { name: "Tackle", power: 40, type: "normal" },
    moves1[1] || moves1[0],
    t2 && moves2[2] ? moves2[2] : moves1[2] || moves1[0],
    moves1[3] || moves1[0],
  ];
};

export const getGymLeaderDefeatQuote = (leaderName: string): string => {
  const quotes: Record<string, string> = {
    Brock:
      "Strong resistance is expected, but you still have much to learn. Train hard and challenge me again!",
    Misty:
      "My water Pokémon are too tough for you! Splash around and train some more before trying again.",
    "Lt. Surge":
      "You need more power, baby! Shock your system with some training and try again!",
    Erika:
      "My grass Pokémon require a delicate touch. Perhaps some more practice will bloom your skills?",
    Koga: "Fwahahaha! My ninja techniques are too stealthy. Polish your strategy and try again.",
    Sabrina:
      "I foresaw your defeat. If you wish to change the future, train your mind and Pokémon and try again.",
    Blaine:
      "You need more fire in your heart! Don't burn out; heat up your training and try again!",
    Giovanni:
      "Is this the best you can do? Team Rocket has no time for weaklings. Go train.",
  };

  const baseName = leaderName.replace("Gym Leader ", "").trim();
  return (
    quotes[baseName] ||
    `A good attempt, but you're not ready yet. Train your Pokémon and try again!`
  );
};

export const toAnimatedSprite = (staticUrl: string): string => {
  if (!staticUrl) return staticUrl;
  if (staticUrl.includes("animated") && staticUrl.endsWith(".gif")) {
    return staticUrl;
  }
  const match = staticUrl.match(/\/pokemon\/(\d+)\.(?:png|gif)/);
  if (match) {
    const id = match[1];
    return `${POKEMON_IMAGE}/versions/generation-v/black-white/animated/${id}.gif`;
  }
  return staticUrl;
};

export const getDifficultyParams = (playerLevel: number) => {
  if (playerLevel < 12) {
    return { statMultiplier: 1.0, minLevelAdd: -1, maxLevelAdd: 1 };
  }
  if (playerLevel < 20) {
    return { statMultiplier: 1.05, minLevelAdd: 0, maxLevelAdd: 2 };
  }
  if (playerLevel < 40) {
    return { statMultiplier: 1.08, minLevelAdd: 1, maxLevelAdd: 3 };
  }
  return { statMultiplier: 1.15, minLevelAdd: 2, maxLevelAdd: 4 };
};
