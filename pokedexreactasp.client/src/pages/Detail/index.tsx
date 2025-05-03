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
  EvolutionChain,
  RelatedPokemon
} from "../../components/ui";

// Import tab components
import AboutTab from "./tabs/AboutTab";
import StatsTab from "./tabs/StatsTab";
import EvolutionTab from "./tabs/EvolutionTab";
import MovesTab from "./tabs/MovesTab";
import SpritesTab from "./tabs/SpritesTab";

import "react-lazy-load-image-component/src/effects/blur.css";
import * as T from "./index.style";
import {
  getDetailPokemon,
  getPokemonSpecies,
  getEvolutionChain,
  getRelatedPokemonByGen
} from "../../services/pokemon";
import { skillColor } from "../../components/utils";

type TypesPokemon = { type: { name: string } };
type MovesPokemon = { move: { name: string } };

const PokemonAvatar = styled(LazyLoadImage)`
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
`;

// Function to get color for stats based on stat value
const getStatColor = (value: number) => {
  if (value < 50) return "#FB7185"; // Low stat - red
  if (value < 80) return "#FBBF24"; // Medium stat - yellow/orange
  if (value < 110) return "#34D399"; // Good stat - green
  return "#818CF8"; // Excellent stat - purple/blue
};

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
  const [activeTab, setActiveTab] = useState<string>("about");

  // New state variables for additional Pokemon data
  const [height, setHeight] = useState<number>(0);
  const [weight, setWeight] = useState<number>(0);
  const [baseExperience, setBaseExperience] = useState<number>(0);
  const [captureRate, setCaptureRate] = useState<number>(0);
  const [baseHappiness, setBaseHappiness] = useState<number>(0);
  const [flavorText, setFlavorText] = useState<string>("");
  const [sprites, setSprites] = useState<any>({});

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

      // For each evolution branch from this Pokémon
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

        // Add this evolution step to our chain
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

        // Process the next chain (recursive)
        await processChain(evolution, evolutions);
      }

      return evolutions;
    };

    return await processChain(evolutionData.chain);
  };

  // Format flavor text by removing weird characters and line breaks
  const formatFlavorText = (text: string) => {
    if (!text) return "";
    return text
      .replace(/\f/g, ' ')
      .replace(/\u00ad\n/g, '')
      .replace(/\u00ad/g, '')
      .replace(/\n/g, ' ');
  };

  // Get a random English flavor text
  const getRandomFlavorText = (species: any) => {
    if (!species || !species.flavor_text_entries || !species.flavor_text_entries.length) return "";

    const englishEntries = species.flavor_text_entries.filter(
      (entry: any) => entry.language.name === "en"
    );

    if (!englishEntries.length) return "";

    const randomIndex = Math.floor(Math.random() * englishEntries.length);
    return formatFlavorText(englishEntries[randomIndex].flavor_text);
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
        response?.sprites.front_default
      );
      setStats(response?.stats);
      setAbilities(response?.abilities);

      // Set new properties
      setHeight(response?.height || 0);
      setWeight(response?.weight || 0);
      setBaseExperience(response?.base_experience || 0);
      setSprites(response?.sprites || {});

      // Load species data, evolution chain, and related Pokemon
      loadSpeciesData(response.id);

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
  async function loadSpeciesData(pokemonId: string | number) {
    try {
      setIsLoadingEvolution(true);

      const speciesData = await getPokemonSpecies(pokemonId);
      setSpecies(speciesData);

      setCaptureRate(speciesData?.capture_rate || 0);
      setBaseHappiness(speciesData?.base_happiness || 0);
      setFlavorText(getRandomFlavorText(speciesData));

      // Extract generation number from URL and load related Pokémon
      if (speciesData && speciesData.generation && speciesData.generation.url) {
        const genNumber = speciesData.generation.url.split('/').filter(Boolean).pop();
        loadRelatedPokemon(genNumber);
      } else {
        // Fallback to generation 1 if we can't determine generation
        loadRelatedPokemon(1);
      }

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

  // Load related Pokemon by generation
  async function loadRelatedPokemon(gen: string | number = 1) {
    try {
      setIsLoadingRelated(true);

      const relatedPokemonData = await getRelatedPokemonByGen(gen);
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
    document.title = `#${pokemonId} - ${name?.toUpperCase()}`;

    return () => {
      document.title = "Pokémon - Catch 'em all!";
    };
  }, [pokemonId, name]);

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

        <T.PokeName style={{ background: types.length > 0 ? `linear-gradient(to right, ${skillColor[`${types[0]}-200`] || '#A8A77A'}, transparent)` : undefined }}>
          <Text as="h1" variant="outlined" size="xl">
            {name}
          </Text>
          <Text as="h2" variant="outlined" size="base" className="genera-text">
            {species && species.genera && species.genera.find((g: any) => g.language.name === 'en')?.genus || ''}
          </Text>
        </T.PokeName>

        <T.PokemonContainer>
          <div className="img-pokemon" style={{ display: "flex", justifyContent: "center" }}>
            {!isLoading ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <PokemonAvatar
                  src={sprite}
                  alt={name}
                  width={256}
                  height={256}
                  effect="blur"
                  loading="lazy"
                  className="pokemon-dt"
                />
                  {/* Type Icons */}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                    {types && types.map((type: string, index: number) => (
                      <TypeIcon key={index} type={type} size="md" />
                    ))}
                  </div>
                  {/* Flavor Text */}
                  {flavorText && (
                    <T.FlavorTextBox>
                      <Text>{flavorText}</Text>
                    </T.FlavorTextBox>
                  )}
              </div>
            ) : (
              <T.ImageLoadingWrapper>
                <Loading />
              </T.ImageLoadingWrapper>
            )}
          </div>

          <div style={{ padding: "0 20px" }}>
            {/* Basic Info Section */}
            <T.InfoSection>
              <div className="info-item">
                <Text className="info-label">Height</Text>
                <Text className="info-value">{(height / 10).toFixed(1)}m</Text>
              </div>
              <div className="info-item">
                <Text className="info-label">Weight</Text>
                <Text className="info-value">{(weight / 10).toFixed(1)}kg</Text>
              </div>
              <div className="info-item">
                <Text className="info-label">Base Experience</Text>
                <Text className="info-value">{baseExperience}</Text>
              </div>
              <div className="info-item">
                <Text className="info-label">Capture Rate</Text>
                <Text className="info-value">{captureRate}</Text>
              </div>
              <div className="info-item">
                <Text className="info-label">Base Happiness</Text>
                <Text className="info-value">{baseHappiness}</Text>
              </div>
            </T.InfoSection>
          </div>
        </T.PokemonContainer>

        <T.Content style={{ marginTop: "30px" }}>
          <T.TabsContainer>
            <div
              className={`tab ${activeTab === 'about' ? 'active' : ''}`}
              onClick={() => setActiveTab('about')}
            >
              <Text>About</Text>
            </div>
            <div
              className={`tab ${activeTab === 'stats' ? 'active' : ''}`}
              onClick={() => setActiveTab('stats')}
            >
              <Text>Stats</Text>
            </div>
            <div
              className={`tab ${activeTab === 'evolution' ? 'active' : ''}`}
              onClick={() => setActiveTab('evolution')}
            >
              <Text>Evolution</Text>
            </div>
            <div
              className={`tab ${activeTab === 'moves' ? 'active' : ''}`}
              onClick={() => setActiveTab('moves')}
            >
              <Text>Moves</Text>
            </div>
            <div
              className={`tab ${activeTab === 'sprites' ? 'active' : ''}`}
              onClick={() => setActiveTab('sprites')}
            >
              <Text>Sprites</Text>
            </div>
          </T.TabsContainer>

          {/* About Tab */}
          {activeTab === 'about' && (
            <AboutTab
              abilities={abilities}
              relatedPokemon={relatedPokemon}
              specialForms={specialForms}
              isLoadingRelated={isLoadingRelated}
              species={species}
              name={name}
            />
          )}

          {/* Stats Tab */}
          {activeTab === 'stats' && (
            <StatsTab stats={stats} />
          )}

          {/* Evolution Tab */}
          {activeTab === 'evolution' && (
            <EvolutionTab
              isLoadingEvolution={isLoadingEvolution}
              evolutionChain={evolutionChain}
            />
          )}

          {/* Moves Tab */}
          {activeTab === 'moves' && (
            <MovesTab moves={moves} types={types} />
          )}

          {/* Sprites Tab */}
          {activeTab === 'sprites' && (
            <SpritesTab sprites={sprites} name={name} />
          )}
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
