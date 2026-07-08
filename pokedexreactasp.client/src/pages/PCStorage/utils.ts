export const getIvJudgeText = (iv: number | null): string => {
  if (iv === null) return "Decent";
  if (iv === 31) return "Best";
  if (iv === 30) return "Fantastic";
  if (iv >= 26) return "Very Good";
  if (iv >= 16) return "Pretty Good";
  if (iv >= 1) return "Decent";
  return "No Good";
};

export const getPokeballSpriteUrl = (ball: number): string => {
  const ballNames: Record<number, string> = {
    0: "poke-ball",
    1: "great-ball",
    2: "ultra-ball",
    3: "master-ball",
    10: "quick-ball",
    11: "timer-ball",
    12: "dusk-ball",
    13: "net-ball",
    14: "dive-ball",
    15: "nest-ball",
    16: "repeat-ball",
    17: "luxury-ball",
    18: "premier-ball",
    19: "heal-ball",
  };
  const name = ballNames[ball] || "poke-ball";
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${name}.png`;
};
