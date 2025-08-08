import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { Header, Navbar, PokeCard, SkeletonCard, Text } from "../../components/ui";
import * as T from "../Explore/index.style";
import { IPokemon } from "../../types/pokemon";
import { getAllPokemon } from "../../services/pokemon";
import { getPokemonId } from "../../components/utils";

// Simple in-module cache so we don't re-download the list for every search
let ALL_POKEMON_CACHE: IPokemon[] | null = null;

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const q = (searchParams.get("q") || "").trim();

  const [loading, setLoading] = useState<boolean>(false);
  const [allPokemon, setAllPokemon] = useState<IPokemon[]>(ALL_POKEMON_CACHE || []);

  useEffect(() => {
    let cancelled = false;

    async function ensureAllPokemonLoaded() {
      if (ALL_POKEMON_CACHE && ALL_POKEMON_CACHE.length) return;
      try {
        setLoading(true);
        // Fetch a large list once and keep it cached in memory
        const resp = await getAllPokemon(20000, 0);
        const list = resp?.results || [];
        if (!cancelled) {
          ALL_POKEMON_CACHE = list;
          setAllPokemon(list);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    // Load list only if not already cached
    if (!ALL_POKEMON_CACHE || !ALL_POKEMON_CACHE.length) {
      ensureAllPokemonLoaded();
    }

    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!q) return [] as IPokemon[];
    const source = ALL_POKEMON_CACHE?.length ? ALL_POKEMON_CACHE : allPokemon;
    const term = q.toLowerCase();
    return (source || []).filter((p) => p.name.toLowerCase().includes(term));
  }, [q, allPokemon]);

  const isEmptyQuery = q.length === 0;
  const isSearching = loading && (!ALL_POKEMON_CACHE || !ALL_POKEMON_CACHE.length);

  return (
    <>
      <T.Container>
        <Header title="Search Pokémon" subtitle={q ? `Results for "${q}"` : "Type a name to search"} />

        {isEmptyQuery ? (
          <div style={{ padding: 24 }}>
            <Text>Start typing a Pokémon name in the search bar.</Text>
          </div>
        ) : isSearching ? (
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
