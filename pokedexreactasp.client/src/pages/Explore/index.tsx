/* eslint-disable react-hooks/exhaustive-deps */
import toast from "react-hot-toast";
import { useState, createRef, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import { useGlobalContext, useAuth } from "../../contexts";
import { IPokemon } from "../../types/pokemon";
import {
  Text,
  Navbar,
  PokeCard,
  Header,
  SkeletonCard,
} from "../../components/ui";

import { getPokemonId } from "../../components/utils";
import { POKEMON_API } from "../../config/api.config";

import * as T from "./index.style";
import { pokemonService, pokeItemService } from "../../services";

const Explore = () => {
  const { state, setState, refreshPokeSummary } = useGlobalContext();
  const { isAuthenticated, isInitialized } = useAuth();
  const navRef = createRef<HTMLDivElement>();

  const [nextUrl, setNextUrl] = useState<string | null>(
    `${POKEMON_API}?limit=20&offset=0`,
  );
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [navHeight, setNavHeight] = useState<number>(0);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [pokeballSprite, setPokeballSprite] = useState<string | null>(null);

  async function loadPokemons() {
    if (nextUrl && !isLoading) {
      try {
        setIsLoading(true);

        // Get the current offset from state
        const offset = state?.pokemons?.length || 0;

        // Fetch pokemon with their types via service layer
        const response = await pokemonService.getPokemonWithTypes(20, offset);

        if (!response || !response.results) {
          setHasMore(false);
          setIsLoading(false);
          return;
        }

        const filteredSummary = response.results.map((result: any) => {
          const summaryIdx =
            state?.pokeSummary?.findIndex(
              (el) => el.name === result.name.toUpperCase(),
            ) || 0;
          return {
            name: result.name,
            url: result.url,
            id: result.id,
            types: result.types || [],
            captured: state?.pokeSummary?.[summaryIdx]?.captured ?? 0,
          };
        });

        setState({ pokemons: [...(state.pokemons || []), ...filteredSummary] });
        const nextStr = (response as any).next as string | null | undefined;
        setNextUrl(nextStr || null);
        setHasMore(!!nextStr);
        setIsLoading(false);
      } catch {
        toast.error("Oops! Failed to get Pokémon. Please try again!");
        setIsLoading(false);
      }
    }
  }

  useEffect(() => {
    if (
      isInitialized &&
      isAuthenticated &&
      (!state.pokeSummary || state.pokeSummary.length === 0)
    ) {
      refreshPokeSummary();
    }
  }, [isInitialized, isAuthenticated]);

  useEffect(() => {
    if (state.pokemons && state.pokeSummary && state.pokeSummary.length > 0) {
      const updatedPokemons = state.pokemons.map((pokemon) => {
        const summaryIdx =
          state.pokeSummary?.findIndex(
            (el) => el.name === pokemon.name.toUpperCase(),
          ) ?? -1;
        return {
          ...pokemon,
          captured:
            summaryIdx >= 0 ? state.pokeSummary![summaryIdx].captured : 0,
        };
      });
      setState({ pokemons: updatedPokemons });
    }
  }, [state.pokeSummary]);

  useEffect(() => {
    setNavHeight(navRef.current?.clientHeight as number);
    if (!state.pokemons?.length) {
      loadPokemons();
    }

    // Fetch pokeball sprite
    const fetchPokeballSprite = async () => {
      const sprite = await pokeItemService.getPokeballSprite();
      setPokeballSprite(sprite);
    };
    fetchPokeballSprite();
  }, []);

  // Scroll to top functionality
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <T.Container style={{ marginBottom: navHeight }}>
        <Header title="Explore Pokémon" subtitle="Challenge & catch them all" />

        <InfiniteScroll
          dataLength={state?.pokemons?.length || 0}
          next={loadPokemons}
          hasMore={hasMore}
          loader={
            <T.Grid>
              {Array(8)
                .fill(0)
                .map((_, index) => (
                  <SkeletonCard key={`skeleton-${index}`} />
                ))}
            </T.Grid>
          }
          endMessage={
            <div style={{ textAlign: "center", padding: "20px" }}>
              <Text>You've caught them all! No more Pokémon to display.</Text>
            </div>
          }
        >
          <T.Grid>
            {state?.pokemons?.length
              ? state?.pokemons.map((pokemon: IPokemon) => {
                  const pokemonId =
                    pokemon.id || getPokemonId(pokemon?.url ?? "");
                  return (
                    <PokeCard
                      key={`${pokemon.name}-${Math.random()}`}
                      pokemonId={pokemonId}
                      name={pokemon?.name}
                      captured={pokemon?.captured}
                      types={pokemon?.types || []}
                    />
                  );
                })
              : null}
          </T.Grid>
        </InfiniteScroll>
      </T.Container>

      <T.ScrollToTop
        onClick={scrollToTop}
        className={showScrollTop ? "visible" : ""}
        aria-label="Scroll to top"
      >
        {pokeballSprite ? (
          <T.PokeballImage src={pokeballSprite} alt="Poke Ball" />
        ) : (
          <T.FallbackIcon>↑</T.FallbackIcon>
        )}
      </T.ScrollToTop>

      <Navbar ref={navRef} />
    </>
  );
};

export default Explore;
