import toast from "react-hot-toast";
import styled from "@emotion/styled";
import { useParams, Link } from "react-router-dom";
import { clearTimeout, setTimeout } from "worker-timers";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { FormEvent, ChangeEvent, useEffect, useState, createRef, useRef } from "react";

import { useGlobalContext, useAuth } from "../../contexts";
import { generatePokeSummary, loadMyPokemonFromLocalStorage } from "../../helpers";
import { collectionService } from "../../services";
import {
  IPokemonDetailResponse,
  IPokemonSpecies,
  INameUrlPair
} from "../../types/pokemon";
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

// Define interfaces for the component's state
type TypesPokemon = { type: { name: string } };
type MovesPokemon = { move: { name: string } };

// Interface for evolution chain items
interface EvolutionItem {
  from: {
    id: number;
    name: string;
    sprite: string;
  };
  to: {
    id: number;
    name: string;
    sprite: string;
  };
  trigger?: {
    text: string;
  };
}

// Interface for related Pokemon
interface RelatedPokemonItem extends INameUrlPair {
  id?: number;
  sprite?: string;
}

// Interface for special forms
interface PokemonForm extends INameUrlPair {
  id?: number;
  sprite?: string;
  is_default?: boolean;
}

// Interface for Pokemon sprites
interface PokemonSprites {
  front_default: string;
  front_shiny?: string;
  front_female?: string | null;
  front_shiny_female?: string | null;
  back_default?: string;
  back_shiny?: string;
  back_female?: string | null;
  back_shiny_female?: string | null;
  other?: {
    dream_world?: {
      front_default: string | null;
      front_female: string | null;
    };
    home?: {
      front_default: string | null;
      front_female: string | null;
      front_shiny: string | null;
      front_shiny_female: string | null;
    };
    "official-artwork"?: {
      front_default: string;
      front_shiny: string | null;
    };
  };
  versions?: Record<string, Record<string, {
    front_default?: string | null;
    front_female?: string | null;
    front_shiny?: string | null;
    front_shiny_female?: string | null;
    back_default?: string | null;
    back_female?: string | null;
    back_shiny?: string | null;
    back_shiny_female?: string | null;
    animated?: {
      front_default: string | null;
      front_female: string | null;
      front_shiny: string | null;
      front_shiny_female: string | null;
      back_default: string | null;
      back_female: string | null;
      back_shiny: string | null;
      back_shiny_female: string | null;
    };
  }>>;
}

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
  const [evolutionChain, setEvolutionChain] = useState<EvolutionItem[]>([]);
  const [relatedPokemon, setRelatedPokemon] = useState<RelatedPokemonItem[]>([]);
  const [specialForms, setSpecialForms] = useState<PokemonForm[]>([]);
  const [species, setSpecies] = useState<IPokemonSpecies | null>(null);
  const [isLoadingEvolution, setIsLoadingEvolution] = useState<boolean>(false);
  const [isLoadingRelated, setIsLoadingRelated] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("about");
  const [heldItems, setHeldItems] = useState<IPokemonDetailResponse["held_items"]>([]);
  const [audioRef] = useState<HTMLAudioElement | null>(typeof Audio !== 'undefined' ? new Audio() : null);
  const [isPlayingCry, setIsPlayingCry] = useState<boolean>(false);
  const [audioProgress, setAudioProgress] = useState<number>(0);
  const [audioDuration, setAudioDuration] = useState<number>(0);
  const [audioVisualization, setAudioVisualization] = useState<number[]>(Array(10).fill(1));

  // New state variables for additional Pokemon data
  const [height, setHeight] = useState<number>(0);
  const [weight, setWeight] = useState<number>(0);
  const [baseExperience, setBaseExperience] = useState<number>(0);
  const [captureRate, setCaptureRate] = useState<number>(0);
  const [baseHappiness, setBaseHappiness] = useState<number>(0);
  const [flavorText, setFlavorText] = useState<string>("");
  const [sprites, setSprites] = useState<PokemonSprites>({ front_default: "" });

  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isCaught, setIsCaught] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCatching, setIsCatching] = useState<boolean>(false);
  const [isEndPhase, setIsEndPhase] = useState<boolean>(false);

  const [nicknameModal, setNicknameModal] = useState<boolean>(false);
  const [nicknameIsValid, setNicknameIsValid] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [catchResult, setCatchResult] = useState<{
    ivTotal?: number;
    ivRating?: string;
    isNewSpecies?: boolean;
    experienceGained?: number;
  } | null>(null);

  const { setState } = useGlobalContext();
  const { isAuthenticated } = useAuth();
  const navRef = createRef<HTMLDivElement>();

  // Helper function to process evolution chain data
  const processEvolutionChain = async (evolutionData: any): Promise<EvolutionItem[]> => {
    // Process chain data to extract evolution details
    const processChain = async (chain: any, evolutions: EvolutionItem[] = []): Promise<EvolutionItem[]> => {
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
      setHeldItems(response?.held_items || []);

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

    if (!nickname.trim()) {
      setNicknameIsValid(false);
      return;
    }

    setIsSaving(true);

    try {
      // If user is authenticated, save to backend
      if (isAuthenticated) {
        const result = await collectionService.catchPokemon({
          pokemonApiId: pokemonId,
          nickname: nickname.trim(),
          caughtLocation: "Wild",
          caughtLevel: Math.floor(Math.random() * 20) + 1,
          isShiny: false, // Could add shiny encounter logic
        });

        if (result.success) {
          setCatchResult({
            ivTotal: result.ivTotal,
            ivRating: result.ivRating,
            isNewSpecies: result.isNewSpecies,
            experienceGained: result.experienceGained,
          });

          // Also save to localStorage for offline access
          saveToLocalStorage();

          toast.success(
            `${result.caughtPokemon?.displayName} was caught! IVs: ${result.ivRating}`,
            { duration: 4000 }
          );

          if (result.isNewSpecies) {
            toast.success("New species registered in Pokédex!", { duration: 3000 });
          }

          if (result.trainerLeveledUp) {
            toast.success(`Trainer leveled up to ${result.newTrainerLevel}!`, { duration: 3000 });
          }

          setIsSaved(true);
        } else {
          toast.error(result.message);
          setNicknameIsValid(false);
        }
      } else {
        // Fallback to localStorage only for non-authenticated users
        const parsed = loadMyPokemonFromLocalStorage();

        // Check for duplicate nickname
        const isDuplicate = parsed.some(p => p.nickname === nickname.trim());
        if (isDuplicate) {
          setNicknameIsValid(false);
          toast.error("You already have a Pokémon with this nickname!");
          setIsSaving(false);
          return;
        }

        saveToLocalStorage();
        toast.success(`${nickname} was caught!`);
        setIsSaved(true);
      }
    } catch (error: any) {
      console.error("Error saving Pokemon:", error);
      toast.error(error.response?.data?.message || "Failed to save Pokemon");
      setNicknameIsValid(false);
    } finally {
      setIsSaving(false);
    }
  }

  function saveToLocalStorage() {
    const parsed = loadMyPokemonFromLocalStorage();
    parsed.push({
      name: name!.toUpperCase(),
      nickname: nickname.trim(),
      sprite,
    });
    localStorage.setItem("pokegames@myPokemon", JSON.stringify(parsed));
    setState({ pokeSummary: generatePokeSummary(parsed) });
  }

  // Play Pokemon cry sound
  async function playPokemonCry() {
    if (!audioRef || !pokemonId) return;

    try {
      setIsPlayingCry(true);
      // Use the official PokeAPI cries
      audioRef.src = `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${pokemonId}.ogg`;

      audioRef.onended = () => setIsPlayingCry(false);
      audioRef.onerror = () => {
        console.error("Error loading Pokemon cry");
        // Fallback to Pokemon Showdown's audio files if the PokeAPI cry fails to load
        if (name) {
          const formattedName = name.toLowerCase().replace('-', '');
          audioRef.src = `https://play.pokemonshowdown.com/audio/cries/${formattedName}.mp3`;
          audioRef.play().catch(() => {
            console.error("Fallback cry also failed to load");
            setIsPlayingCry(false);
          });
        } else {
          setIsPlayingCry(false);
        }
      };

      await audioRef.play();
    } catch (error) {
      console.error("Error playing Pokemon cry:", error);
      setIsPlayingCry(false);
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

  // Setup audio event listeners for progress tracking and visualization
  useEffect(() => {
    if (!audioRef) return;

    // Track audio time updates to update progress bar
    const handleTimeUpdate = () => {
      if (!audioRef.duration) return;
      setAudioProgress(audioRef.currentTime / audioRef.duration);

      // Generate random visualization data for sound waves
      const newVisualization = audioVisualization.map(() => {
        // Create dynamic heights between 0.4 and 1.0 for the sound bars
        return Math.max(0.4, Math.random() * 0.6 + 0.4);
      });
      setAudioVisualization(newVisualization);
    };

    // Set the duration when audio data is loaded
    const handleLoadedMetadata = () => {
      setAudioDuration(audioRef.duration);
    };

    // Reset states when audio ends
    const handleEnded = () => {
      setAudioProgress(0);
      setIsPlayingCry(false);
      setAudioVisualization(Array(10).fill(1));
    };

    // Add event listeners
    audioRef.addEventListener('timeupdate', handleTimeUpdate);
    audioRef.addEventListener('loadedmetadata', handleLoadedMetadata);
    audioRef.addEventListener('ended', handleEnded);

    // Clean up event listeners
    return () => {
      audioRef.removeEventListener('timeupdate', handleTimeUpdate);
      audioRef.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audioRef.removeEventListener('ended', handleEnded);
    };
  }, [audioRef, audioVisualization]);

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
                  {!isAuthenticated && (
                    <Text variant="light" size="sm" style={{ marginTop: 8 }}>
                      💡 Log in to save to your collection and track IVs!
                    </Text>
                  )}
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
                disabled={isSaving}
              />

              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </T.NicknamingForm>
          ) : (
            <T.AnotherWrapper>
              <div className="pxl-border" style={{ textAlign: "left" }}>
                <Text>Whoosh! {nickname} is now in your Pokémon list!</Text>

                {catchResult && isAuthenticated && (
                  <div style={{ marginTop: 12, padding: "8px 0" }}>
                    <Text size="sm" style={{ color: "#60A5FA" }}>
                      ⭐ IV Rating: <strong>{catchResult.ivRating}</strong> ({catchResult.ivTotal}/186)
                    </Text>
                    {catchResult.experienceGained && (
                      <Text size="sm" style={{ color: "#34D399", marginTop: 4 }}>
                        +{catchResult.experienceGained} XP gained!
                      </Text>
                    )}
                    {catchResult.isNewSpecies && (
                      <Text size="sm" style={{ color: "#FBBF24", marginTop: 4 }}>
                        🆕 New species registered!
                      </Text>
                    )}
                  </div>
                )}
              </div>

              <Link to="/my-pokemon">
                <Button variant="light">See My Pokémon</Button>
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
                <Text style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                  {Math.round((captureRate / 255) * 100)}% at full health
                </Text>
              </div>
              <div className="info-item">
                <Text className="info-label">Base Happiness</Text>
                <Text className="info-value">{baseHappiness}</Text>
              </div>
            </T.InfoSection>
            <div className="info-item" style={{ alignItems: "center", justifyContent: "left", paddingTop: '12px', display: 'flex', flexDirection: 'row' }}>
              <button
                onClick={playPokemonCry}
                disabled={isPlayingCry}
                style={{
                  background: isPlayingCry ? `rgba(255, 255, 255, 0.3)` : 'rgba(255, 255, 255, 0.15)',
                  border: '2px solid rgba(100, 100, 100, 0.3)',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '12px',
                  transition: 'all 0.3s ease',
                  boxShadow: isPlayingCry ? '0 0 8px 2px rgba(255, 255, 255, 0.6)' : 'none',
                  width: '60px',
                  height: '60px'
                }}
                title="Play Pokémon cry"
              >
                {isPlayingCry ? (
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Pokeball-themed sound icon (playing) */}
                    <circle cx="12" cy="12" r="10" fill="#FF5555" />
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z" fill="white" />
                    <path d="M12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z" fill="white" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M2 12C2 6.48 6.48 2 12 2V4C7.58 4 4 7.58 4 12H2Z" fill="#FFF">
                      <animate attributeName="opacity" values="1;0.5;1" dur="1s" repeatCount="indefinite" />
                    </path>
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C17.52 2 22 6.48 22 12H20C20 7.58 16.42 4 12 4V2Z" fill="#FFF">
                      <animate attributeName="opacity" values="1;0.5;1" dur="1s" repeatCount="indefinite" />
                    </path>
                    {/* Sound waves */}
                    <path d="M16 8C17.1 8.9 18 10.4 18 12C18 13.6 17.1 15.1 16 16" stroke="white" strokeWidth="2" strokeLinecap="round">
                      <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite" />
                    </path>
                  </svg>
                ) : (
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Pokeball-themed sound icon (not playing) */}
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z" fill="#333" />
                    <path d="M12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z" fill="#333" />
                    <path d="M2 12C2 6.48 6.48 2 12 2V4C7.58 4 4 7.58 4 12H2Z" fill="#FF5555" />
                    <path d="M12 2C17.52 2 22 6.48 22 12H20C20 7.58 16.42 4 12 4V2Z" fill="#FF5555" />
                    {/* Sound waves */}
                    <path d="M16 8C17.1 8.9 18 10.4 18 12C18 13.6 17.1 15.1 16 16" stroke="#333" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                )}
              </button>
              {/* Sound bar visualization */}
              {isPlayingCry && (
                <T.SoundBar>
                  <div
                    className="sound-bar-progress"
                    style={{ width: `${audioProgress * 100}%` }}
                  />
                  <div className="sound-bar-visualization">
                    {audioVisualization.map((height, index) => (
                      <div
                        key={index}
                        className="sound-bar-line"
                        style={{
                          transform: `scaleY(${height})`,
                          backgroundColor: index % 2 === 0 ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.5)'
                        }}
                      />
                    ))}
                  </div>
                </T.SoundBar>
              )}
            </div>
            <Text style={{ marginLeft: "10px" }} variant="outlined" size="lg">
              {isPlayingCry ? "Playing..." : "Cry"}
            </Text>
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
              heldItems={heldItems}
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
