import { useQuery } from "@tanstack/react-query";
import { getCardsByPokemonName } from "../services/tcg";

export const useTCGCards = (pokemonName: string) => {
  return useQuery({
    queryKey: ["tcg-cards", pokemonName],
    queryFn: () => getCardsByPokemonName(pokemonName),
    enabled: !!pokemonName,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};
