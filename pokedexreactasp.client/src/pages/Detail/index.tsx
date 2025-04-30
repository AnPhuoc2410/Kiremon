import toast from "react-hot-toast";
import styled from "@emotion/styled";
import { useParams, Link } from "react-router-dom";
import { clearTimeout, setTimeout } from "worker-timers";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { FormEvent, ChangeEvent, useEffect, useState, createRef, useRef } from "react";

import { useGlobalContext } from "../../contexts";
import { generatePokeSummary } from "../../helpers";
import { IPokemonDetailResponse } from "../../types/pokemon";
import {
  Button,
  Navbar,
  Text,
  Loading,
  TypeIcon,
  Input,
  Modal,
  Header,
  EvolutionChain,
  RelatedPokemon
} from "../../components/ui";

import "react-lazy-load-image-component/src/effects/blur.css";
import * as T from "./index.style";
import {
  getDetailPokemon,
  getPokemonSpecies,
  getEvolutionChain,
  getRelatedPokemonByType
} from "../../services/pokemon";

type TypesPokemon = { type: { name: string } };
type MovesPokemon = { move: { name: string } };

const PokemonAvatar = styled(LazyLoadImage)`
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
`;

const DetailPokemon = () => {
  const { name = "" } = useParams();

  const catchPokemonTimeout = useRef<NodeJS.Timeout | number>(0);
  const throwBallTimeout = useRef<NodeJS.Timeout | number>(0);

  const [sprite, setSprite] = useState<string>("");
  const [types, setTypes] = useState<string[]>([]);
  const [moves, setMoves] = useState<string[]>([]);
  const [nickname, setNickname] = useState<string>("");
  const [navHeight, setNavHeight] = useState<number>(0);
  const [stats, setStats] = useState<IPokemonDetailResponse["stats"]>([]);
  const [abilities, setAbilities] = useState<IPokemonDetailResponse["abilities"]>([]);
  const [pokemonId, setPokemonId] = useState<number>(0);
  const [evolutionChain, setEvolutionChain] = useState<any[]>([]);
  const [relatedPokemon, setRelatedPokemon] = useState<any[]>([]);
  const [specialForms, setSpecialForms] = useState<any[]>([]);
  const [species, setSpecies] = useState<any>(null);
  const [isLoadingEvolution, setIsLoadingEvolution] = useState<boolean>(false);
  const [isLoadingRelated, setIsLoadingRelated] = useState<boolean>(false);

  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isCaught, setIsCaught] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCatching, setIsCatching] = useState<boolean>(false);
  const [isEndPhase, setIsEndPhase] = useState<boolean>(false);

  const [nicknameModal, setNicknameModal] = useState<boolean>(false);
  const [nicknameIsValid, setNicknameIsValid] = useState<boolean>(true);

  const { setState } = useGlobalContext();
  const navRef = createRef<HTMLDivElement>();

  // Helper function to process evolution chain data
  const processEvolutionChain = async (evolutionData: any) => {
    // Process chain data to extract evolution details
    const processChain = async (chain: any, evolutions: any[] = []) => {
      if (!chain) return evolutions;

      const pokemonDetailsFrom = await getDetailPokemon(chain.species.name);

      for (const evolution of chain.evolves_to) {
        const pokemonDetailsTo = await getDetailPokemon(evolution.species.name);

        // Get evolution trigger (level, item, trade, etc.)
        let triggerText = '';
        if (evolution.evolution_details && evolution.evolution_details.length > 0) {
          const detail = evolution.evolution_details[0];

          if (detail.min_level) {
            triggerText = `Level ${detail.min_level}`;
          } else if (detail.item) {
            triggerText = `Use ${detail.item.name.replace('-', ' ')}`;
          } else if (detail.trigger && detail.trigger.name === 'trade') {
            triggerText = 'Trade';
            if (detail.held_item) {
              triggerText += ` holding ${detail.held_item.name.replace('-', ' ')}`;
            }
          } else if (detail.min_happiness) {
            triggerText = `Happiness (${detail.min_happiness}+)`;
          } else if (detail.trigger) {
            triggerText = detail.trigger.name.replace('-', ' ');
          }
        }

        evolutions.push({
          from: {
            id: pokemonDetailsFrom.id,
            name: chain.species.name,
            sprite: pokemonDetailsFrom.sprites.front_default
          },
          to: {
            id: pokemonDetailsTo.id,
            name: evolution.species.name,
            sprite: pokemonDetailsTo.sprites.front_default
          },
          trigger: triggerText ? { text: triggerText } : undefined
        });

        // Process the next chain
        await processChain(evolution, evolutions);
      }

      return evolutions;
    };

    return await processChain(evolutionData.chain);
  };

  async function loadPokemon() {
    try {
      setIsLoading(true);

      const response = await getDetailPokemon(name);

      // Set basic Pokemon data
      setPokemonId(response?.id || 0);
      setTypes(response?.types.map((type: TypesPokemon) => type.type?.name));
      setMoves(response?.moves.map((move: MovesPokemon) => move.move?.name));
      setSprite(
        response?.sprites.versions?.["generation-v"]?.["black-white"].animated.front_default ||
        response?.sprites.front_default,
      );
      setStats(response?.stats);
      setAbilities(response?.abilities);

      // Load species data, evolution chain, and related Pokemon
      loadSpeciesData(response.id);
      loadRelatedPokemon(response?.types.map((type: TypesPokemon) => type.type?.name)[0]);

      // Check for special forms
      if (response.forms && response.forms.length > 1) {
        setSpecialForms(response.forms);
      }

      setIsLoading(false);
    } catch (error) {
      toast.error("Oops! Failed to get Pokemon data. Please try again!");
      setIsLoading(false);
      console.error({ error });
    }
  }

  // Load species data and evolution chain
  async function loadSpeciesData(pokemonId: string) {
    try {
      setIsLoadingEvolution(true);

      const speciesData = await getPokemonSpecies(pokemonId);
      setSpecies(speciesData);

      // Get evolution chain if available
      if (speciesData && speciesData.evolution_chain && speciesData.evolution_chain.url) {
        const evolutionData = await getEvolutionChain(speciesData.evolution_chain.url);

        if (evolutionData) {
          const processedEvolutions = await processEvolutionChain(evolutionData);
          setEvolutionChain(processedEvolutions);
        }
      }

      setIsLoadingEvolution(false);
    } catch (error) {
      console.error("Error loading species data:", error);
      setIsLoadingEvolution(false);
    }
  }

  // Load related Pokemon by type
  async function loadRelatedPokemon(type: string) {
    if (!type) return;

    try {
      setIsLoadingRelated(true);

      const relatedPokemonData = await getRelatedPokemonByType(type);
      // Filter out current Pokemon from related list
      const filtered = relatedPokemonData.filter((p: any) => p.name !== name);
      setRelatedPokemon(filtered.slice(0, 6));

      setIsLoadingRelated(false);
    } catch (error) {
      console.error("Error loading related Pokemon:", error);
      setIsLoadingRelated(false);
    }
  }

  async function catchPokemon() {
    if (catchPokemonTimeout.current) clearTimeout(catchPokemonTimeout.current as number);

    return new Promise((resolve) => {
      catchPokemonTimeout.current = setTimeout(() => {
        resolve(Math.random() < 0.5 ? false : true);
      }, 2000);
    });
  }

  async function throwPokeball() {
    setIsCatching(true);
    const isCaught = await catchPokemon();
    setIsCatching(false);
    setIsEndPhase(true);

    if (isCaught) {
      setIsCaught(true);
    } else {
      setIsCaught(false);
    }

    if (throwBallTimeout.current) clearTimeout(throwBallTimeout.current as number);

    throwBallTimeout.current = setTimeout(() => {
      setIsEndPhase(false);
      isCaught && setNicknameModal(true);
    }, 1200);
  }

  async function onNicknameSave(e: FormEvent) {
    e.preventDefault();

    const currentCollection = localStorage.getItem("pokegames@myPokemon");
    const parsed: { name: string; nickname: string; sprite: string }[] =
      JSON.parse(currentCollection!) || [];

    let isUnique = true;
    for (const collection of parsed) {
      if (collection.nickname === nickname) {
        setNicknameIsValid(false);
        isUnique = false;
        return;
      } else {
        !nicknameIsValid && setNicknameIsValid(true);
        isUnique = true;
      }
    }

    if (isUnique) {
      parsed.push({
        name: name!.toUpperCase(),
        nickname,
        sprite,
      });
      localStorage.setItem("pokegames@myPokemon", JSON.stringify(parsed));
      setState({ pokeSummary: generatePokeSummary(parsed) });
      setIsSaved(true);
    }
  }

  useEffect(() => {
    setNavHeight(navRef.current?.clientHeight as number);
    loadPokemon();

    return () => {
      setTypes([]);
      setMoves([]);
      setStats([]);
      setSprite("");
      setAbilities([]);
      setEvolutionChain([]);
      setRelatedPokemon([]);
      setSpecialForms([]);
      setSpecies(null);
    };
  }, [name]);

  useEffect(() => {
    document.title = `Pokegames - ${name?.toUpperCase()}`;

    return () => {
      document.title = "Pokegames";
    };
  }, []);

  useEffect(() => {
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <>
      <Modal open={isCatching}>
        <T.CatchingModal>
          <T.ImageContainer>
            <PokemonAvatar
              src={sprite}
              alt={name}
              width={320}
              height={320}
              effect="blur"
              loading="lazy"
              className="pokemon-dt"
            />
          </T.ImageContainer>
          <div style={{ display: "grid", placeItems: "center" }}>
            <LazyLoadImage
              className="pokeball"
              src="/static/pokeball.png"
              alt="pokeball"
              width={128}
              height={128}
            />
            <Text variant="outlined" size="xl">
              Catching...
            </Text>
          </div>
        </T.CatchingModal>
      </Modal>

      {isEndPhase && (
        <>
          <Modal open={!isCaught} overlay="error">
            <T.PostCatchModal>
              <T.ImageContainer>
                <LazyLoadImage
                  src={sprite}
                  alt={name}
                  width={320}
                  height={320}
                  effect="blur"
                  loading="lazy"
                  className="pokemon-dt"
                />
              </T.ImageContainer>

              <LazyLoadImage src="/static/pokeball.png" alt="pokeball" width={128} height={128} />
              <Text variant="outlined" size="xl">
                Oh no, {name?.toUpperCase()} broke free
              </Text>
            </T.PostCatchModal>
          </Modal>
          <Modal open={isCaught} overlay="light">
            <T.PostCatchModal>
              <T.ImageContainer>
                <PokemonAvatar
                  src={sprite}
                  alt={name}
                  width={320}
                  height={320}
                  effect="blur"
                  loading="lazy"
                  className="pokemon-dt"
                />
              </T.ImageContainer>

              <LazyLoadImage src="/static/pokeball.png" alt="pokeball" width={128} height={128} />
              <Text variant="outlined" size="xl">
                Gotcha! {name?.toUpperCase()} was caught!
              </Text>
            </T.PostCatchModal>
          </Modal>
        </>
      )}

      <Modal open={nicknameModal} overlay="light" solid>
        <T.NicknamingModal>
          <T.ImageContainer>
            <PokemonAvatar
              src={sprite}
              alt={name}
              width={320}
              height={320}
              effect="blur"
              loading="lazy"
              className="pokemon-dt"
            />
          </T.ImageContainer>

          {!isSaved ? (
            <T.NicknamingForm onSubmit={onNicknameSave}>
              {nicknameIsValid ? (
                <div className="pxl-border" style={{ textAlign: "left" }}>
                  <Text>Congratulations!</Text>
                  <Text>You just caught a {name?.toUpperCase()}</Text>
                  <br />
                  <Text>Now please give {name?.toUpperCase()} a nickname...</Text>
                </div>
              ) : (
                <div className="pxl-border" style={{ textAlign: "left" }}>
                  <Text variant="error">Nickname is taken</Text>
                  <Text>Please pick another nickname...</Text>
                </div>
              )}

              <Input
                required
                placeholder="enter a nickname"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setNickname(e.target.value.toUpperCase())
                }
              />

              <Button type="submit">Save</Button>
            </T.NicknamingForm>
          ) : (
            <T.AnotherWrapper>
              <div className="pxl-border" style={{ textAlign: "left" }}>
                <Text>Whoosh! {nickname} is now in your Pokemon list</Text>
              </div>

              <Link to="/my-pokemon">
                <Button variant="light">See My Pokemon</Button>
              </Link>
              <Link to="/pokemons">
                <Button>Catch Another</Button>
              </Link>
            </T.AnotherWrapper>
          )}
        </T.NicknamingModal>
      </Modal>

      <T.Page style={{ marginBottom: navHeight }}>
        <LazyLoadImage
          id="pokeball-bg"
          src="/static/pokeball-transparent.png"
          alt="pokeball background"
          width={512}
          height={512}
        />

        <T.PokeName>
          <div />
          <div />
          <div />
          <Text as="h1" variant="outlined" size="xl" >
            {name}
          </Text>
        </T.PokeName>
        <Header
          title={name}
          subtitle={species ? `${species.genera.find((g: any) => g.language.name === 'en')?.genus || ''}` : ''}
          backTo="/pokemons"
        />

        <T.PokemonContainer>
          <div className="pxl-border card-pxl">
            <Text as="h4" variant="outlined" size="lg">
              Pokemon Stats:
            </Text>
            <T.PokemonStatsWrapper>
              {stats?.map((stat, index) => {
                const pokemonBaseStat = stat?.base_stat ?? 0;
                const pokemonStatName = stat?.stat;

                return (
                  <Text as="h4" key={index} variant="outlined" size="base">
                    {pokemonStatName?.name} : {pokemonBaseStat}
                  </Text>
                );
              })}
            </T.PokemonStatsWrapper>
          </div>
          <div className="img-pokemon" style={{ display: "flex", justifyContent: "center" }}>
            {!isLoading ? (
              <PokemonAvatar
                src={sprite}
                alt={name}
                width={256}
                height={256}
                effect="blur"
                loading="lazy"
                className="pokemon-dt"
              />
            ) : (
              <T.ImageLoadingWrapper>
                <Loading />
              </T.ImageLoadingWrapper>
            )}
          </div>
        </T.PokemonContainer>

        <T.Content style={{ marginTop: "30px" }}>
          <T.AbilitiesWrapper>
            <div className="pxl-type">
              <Text as="h3">Type</Text>
              {!isLoading ? (
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  {types && types.map((type: string, index: number) => (
                    <TypeIcon key={index} type={type} size="md" />
                  ))}
                </div>
              ) : (
                <T.DescriptionLoadingWrapper>
                  <Loading label="Loading types..." />
                </T.DescriptionLoadingWrapper>
              )}
            </div>

            <div className="pxl-abilities">
              <Text as="h3">Abilities</Text>
              {!isLoading ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                  {abilities && abilities.map((ability, index) => (
                    <div
                      key={index}
                      className="pxl-border"
                      style={{
                        padding: '4px 10px',
                        backgroundColor: ability.is_hidden ? '#F3F4F6' : 'white',
                        borderRadius: '4px'
                      }}
                    >
                      <Text>{ability.ability?.name}</Text>
                      {ability.is_hidden && (
                        <Text style={{ fontSize: '10px', color: '#6B7280' }}>(Hidden)</Text>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <T.DescriptionLoadingWrapper>
                  <Loading label="Loading abilities..." />
                </T.DescriptionLoadingWrapper>
              )}
            </div>
          </T.AbilitiesWrapper>

          {/* Evolution chain section */}
          {(evolutionChain.length > 0 || isLoadingEvolution) && (
            <div className="pxl-border card-pxl" style={{ marginTop: '24px' }}>
              <Text as="h3">Evolution Chain</Text>
              {isLoadingEvolution ? (
                <T.DescriptionLoadingWrapper>
                  <Loading label="Loading evolution data..." />
                </T.DescriptionLoadingWrapper>
              ) : (
                <EvolutionChain evolutions={evolutionChain} />
              )}
            </div>
          )}

          {/* Related Pokemon section */}
          {(relatedPokemon.length > 0 || isLoadingRelated) && (
            <div className="pxl-border card-pxl" style={{ marginTop: '24px' }}>
              {isLoadingRelated ? (
                <T.DescriptionLoadingWrapper>
                  <Loading label="Loading related Pokémon..." />
                </T.DescriptionLoadingWrapper>
              ) : (
                <RelatedPokemon
                  pokemonList={relatedPokemon}
                  title={`Related ${types[0]} Pokémon`}
                />
              )}
            </div>
          )}

          {/* Special forms section (if available) */}
          {specialForms.length > 1 && (
            <div className="pxl-border card-pxl" style={{ marginTop: '24px' }}>
              <Text as="h3">Forms & Variants</Text>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '12px',
                marginTop: '16px',
                justifyContent: 'center'
              }}>
                {specialForms.map((form, index) => (
                  <div key={index} style={{ textAlign: 'center' }}>
                    <LazyLoadImage
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${form.url.split('/').filter(Boolean).pop()}.png`}
                      alt={form.name}
                      width={80}
                      height={80}
                      effect="blur"
                    />
                    <Text style={{ fontSize: '12px', textTransform: 'capitalize' }}>
                      {form.name.replace(name, '').replace('-', ' ').trim() || 'Default'}
                    </Text>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Moves section */}
          <div className="pxl-border card-pxl" style={{ marginTop: '24px' }}>
            <Text as="h3">Moves</Text>
            {!isLoading ? (
              <T.Grid>
                {moves &&
                  moves.slice(0, 20).map((move: string, index: number) => (
                    <div
                      key={index}
                      className="pxl-border"
                      style={{ marginBottom: 16, marginRight: 16, padding: '8px 12px', borderRadius: '4px' }}>
                      <Text>{move.replace('-', ' ')}</Text>
                    </div>
                  ))}
                {moves.length > 20 && (
                  <div className="pxl-border" style={{ marginBottom: 16, marginRight: 16, padding: '8px 12px', textAlign: 'center' }}>
                    <Text>+ {moves.length - 20} more moves</Text>
                  </div>
                )}
              </T.Grid>
            ) : (
              <T.DescriptionLoadingWrapper>
                <Loading label="Loading moves..." />
              </T.DescriptionLoadingWrapper>
            )}
          </div>
        </T.Content>
      </T.Page>

      <Navbar ref={navRef} fadeHeight={224}>
        {!isLoading && (
          <Button
            variant="dark"
            onClick={() => throwPokeball()}
            size="xl"
            icon="/static/pokeball.png">
            Catch
          </Button>
        )}
      </Navbar>
    </>
  );
};

export default DetailPokemon;
