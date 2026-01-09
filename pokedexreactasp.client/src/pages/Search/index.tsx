import React, { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import {
  Header,
  Navbar,
  PokeCard,
  SkeletonCard,
  Text,
} from "../../components/ui";
import * as T from "../Explore/index.style";
import { IPokemon } from "../../types/pokemon";
import { getPokemonId } from "../../components/utils";
import { useAllPokemon } from "../../components/hooks/usePokeAPI";

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const q = (searchParams.get("q") || "").trim();

  // Fetch a large page once; service layer caches by (limit, offset)
  const { data, isLoading } = useAllPokemon(2000, 0);
  const allPokemon = (data?.results as IPokemon[] | undefined) || [];

  const filtered = useMemo(() => {
    if (!q) return [] as IPokemon[];
    const term = q.toLowerCase();
    return (allPokemon || []).filter((p) =>
      p.name.toLowerCase().includes(term),
    );
  }, [q, allPokemon]);

  const isEmptyQuery = q.length === 0;

  return (
    <>
      <T.Container>
        <Header
          title="Search Pokémon"
          subtitle={q ? `Results for "${q}"` : "Type a name to search"}
        />

        {isEmptyQuery ? (
          <div style={{ padding: 24 }}>
            <Text>Start typing a Pokémon name in the search bar.</Text>
          </div>
        ) : isLoading ? (
          <T.Grid>
            {Array(8)
              .fill(0)
              .map((_, i) => (
                <SkeletonCard key={`skeleton-${i}`} />
              ))}
          </T.Grid>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 24 }}>
            <Text>No Pokémon found matching "{q}".</Text>
          </div>
        ) : (
          <T.Grid>
            {filtered.map((pokemon) => {
              const pokemonId = getPokemonId(pokemon.url || "");
              return (
                <PokeCard
                  key={pokemon.name}
                  pokemonId={pokemonId}
                  name={pokemon.name}
                  captured={0}
                  types={[]}
                />
              );
            })}
          </T.Grid>
        )}
      </T.Container>

      <Navbar />
    </>
  );
};

export default SearchPage;
