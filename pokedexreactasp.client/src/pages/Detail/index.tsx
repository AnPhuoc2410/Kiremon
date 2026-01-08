import styled from "@emotion/styled";
import {
  ChangeEvent,
  createRef,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link, useParams } from "react-router-dom";
import { clearTimeout, setTimeout } from "worker-timers";

import {
  Button,
  Input,
  Loading,
  Modal,
  Navbar,
  Text,
  TypeIcon,
} from "../../components/ui";
import { useAuth, useGlobalContext } from "../../contexts";
import { collectionService } from "../../services";
import {
  EvolutionItem,
  IPokemonDetailResponse,
  IPokemonSpecies,
  PokemonForm,
  PokemonSprites,
  RelatedPokemonItem,
} from "../../types/pokemon";
import { CatchAttemptResult, PokeballType } from "../../types/pokemon.enums";
import {
  CatchAttemptResultDto,
  CaughtPokemonDto,
} from "../../types/userspokemon.types";

// Import tab components
import AboutTab from "./tabs/AboutTab";
import BreedingTab from "./tabs/BreedingTab";
import EvolutionTab from "./tabs/EvolutionTab";
import MovesTab from "./tabs/MovesTab";
import SpritesTab from "./tabs/SpritesTab";
import StatsTab from "./tabs/StatsTab";
import TrainingTab from "./tabs/TrainingTab";
import VarietiesTab from "./tabs/VarietiesTab";

import "react-lazy-load-image-component/src/effects/blur.css";
import { skillColor } from "../../components/utils";
import { POKEMON_SHOWDOWN_IMAGE } from "../../config/api.config";
import {
  getDetailPokemon,
  getEvolutionChain,
  getPokemonSpecies,
  getRelatedPokemonByGen,
} from "../../services/pokemon";
import * as T from "./index.style";

// Define interfaces for the component's state
type TypesPokemon = { type: { name: string } };
type MovesPokemon = { move: { name: string } };

const PokemonAvatar = styled(LazyLoadImage)`
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
`;

const DetailPokemon = () => {
  const { name = "" } = useParams();

  const throwBallTimeout = useRef<NodeJS.Timeout | number>(0);

  const [sprite, setSprite] = useState<string>("");
  const [types, setTypes] = useState<string[]>([]);
  const [moves, setMoves] = useState<string[]>([]);
  const [nickname, setNickname] = useState<string>("");
  const [navHeight, setNavHeight] = useState<number>(0);
  const [stats, setStats] = useState<IPokemonDetailResponse["stats"]>([]);
  const [abilities, setAbilities] = useState<
    IPokemonDetailResponse["abilities"]
  >([]);
  const [pokemonId, setPokemonId] = useState<number>(0);
  const [evolutionChain, setEvolutionChain] = useState<EvolutionItem[]>([]);
  const [relatedPokemon, setRelatedPokemon] = useState<RelatedPokemonItem[]>(
    [],
  );
  const [specialForms, setSpecialForms] = useState<PokemonForm[]>([]);
  const [species, setSpecies] = useState<IPokemonSpecies | null>(null);
  const [isLoadingEvolution, setIsLoadingEvolution] = useState<boolean>(false);
  const [isLoadingRelated, setIsLoadingRelated] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("about");
  const [heldItems, setHeldItems] = useState<
    IPokemonDetailResponse["held_items"]
  >([]);
  const [audioRef] = useState<HTMLAudioElement | null>(
    typeof Audio !== "undefined" ? new Audio() : null,
  );
  const [isPlayingCry, setIsPlayingCry] = useState<boolean>(false);
  const [audioProgress, setAudioProgress] = useState<number>(0);
  const [audioDuration, setAudioDuration] = useState<number>(0);
  const [audioVisualization, setAudioVisualization] = useState<number[]>(
    Array(10).fill(1),
  );

  // New state variables for additional Pokemon data
  const [height, setHeight] = useState<number>(0);
  const [weight, setWeight] = useState<number>(0);
  const [baseExperience, setBaseExperience] = useState<number>(0);
  const [captureRate, setCaptureRate] = useState<number>(0);
  const [baseHappiness, setBaseHappiness] = useState<number>(0);
  const [flavorText, setFlavorText] = useState<string>("");
  const [sprites, setSprites] = useState<PokemonSprites>({ front_default: "" });
  const [varieties, setVarieties] = useState<IPokemonSpecies["varieties"]>([]);

  // Additional Pokemon species information
  const [eggGroups, setEggGroups] = useState<string[]>([]);
  const [habitat, setHabitat] = useState<string>("");
  const [growthRate, setGrowthRate] = useState<string>("");
  const [generation, setGeneration] = useState<string>("");
  const [isLegendary, setIsLegendary] = useState<boolean>(false);
  const [isMythical, setIsMythical] = useState<boolean>(false);
  const [shape, setShape] = useState<string>("");
  const [color, setColor] = useState<string>("");
  const [hatchCounter, setHatchCounter] = useState<number>(0);
  const [genderRate, setGenderRate] = useState<number>(-1);

  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isCaught, setIsCaught] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCatching, setIsCatching] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);
  const [fallbackLevel, setFallbackLevel] = useState<number>(0);
  const [isEndPhase, setIsEndPhase] = useState<boolean>(false);

  const [nicknameModal, setNicknameModal] = useState<boolean>(false);
  const [nicknameIsValid, setNicknameIsValid] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [shakeCount, setShakeCount] = useState<number>(0);
  const [catchRatePercent, setCatchRatePercentState] = useState<number>(0);
  const [catchAttemptResult, setCatchAttemptResult] =
    useState<CatchAttemptResultDto | null>(null);
  const [caughtPokemonData, setCaughtPokemonData] =
    useState<CaughtPokemonDto | null>(null);
  const [isPokemonFled, setIsPokemonFled] = useState<boolean>(false);
  const [catchResult, setCatchResult] = useState<{
    ivTotal?: number;
    ivRating?: string;
    isNewSpecies?: boolean;
    experienceGained?: number;
  } | null>(null);

  const { refreshPokeSummary } = useGlobalContext();
  const { isAuthenticated } = useAuth();
  const navRef = createRef<HTMLDivElement>();

  // Helper function to process evolution chain data
  const processEvolutionChain = async (
    evolutionData: any,
  ): Promise<EvolutionItem[]> => {
    // Process chain data to extract evolution details
    const processChain = async (
      chain: any,
      evolutions: EvolutionItem[] = [],
    ): Promise<EvolutionItem[]> => {
      if (!chain) return evolutions;

      const pokemonDetailsFrom = await getDetailPokemon(chain.species.name);

      // For each evolution branch from this Pokémon
      for (const evolution of chain.evolves_to) {
        const pokemonDetailsTo = await getDetailPokemon(evolution.species.name);

        // Get evolution trigger details
        let triggerText = "";
        let triggerData: EvolutionItem["trigger"] = { text: "" };

        if (
          evolution.evolution_details &&
          evolution.evolution_details.length > 0
        ) {
          const detail = evolution.evolution_details[0];
          const textParts: string[] = [];

          // Basic trigger type
          if (detail.trigger) {
            triggerData.type = detail.trigger.name;
          }

          // Level requirement
          if (detail.min_level) {
            triggerData.minLevel = detail.min_level;
            textParts.push(`Level ${detail.min_level}`);
          }

          // Evolution item (stones, etc.)
          if (detail.item) {
            triggerData.item = detail.item.name;
            textParts.push(`Use ${detail.item.name.replace(/-/g, " ")}`);
          }

          // Held item during trade
          if (detail.held_item) {
            triggerData.heldItem = detail.held_item.name;
            if (detail.trigger?.name === "trade") {
              textParts.push(
                `Trade holding ${detail.held_item.name.replace(/-/g, " ")}`,
              );
            }
          }

          // Trade trigger
          if (
            detail.trigger?.name === "trade" &&
            !detail.held_item &&
            !detail.trade_species
          ) {
            textParts.push("Trade");
          }

          // Trade for specific Pokemon
          if (detail.trade_species) {
            triggerData.tradeSpecies = detail.trade_species.name;
            textParts.push(`Trade for ${detail.trade_species.name}`);
          }

          // Happiness requirement
          if (detail.min_happiness) {
            triggerData.minHappiness = detail.min_happiness;
            textParts.push(`Happiness ${detail.min_happiness}+`);
          }

          // Beauty requirement (Feebas -> Milotic in some games)
          if (detail.min_beauty) {
            triggerData.minBeauty = detail.min_beauty;
            textParts.push(`Beauty ${detail.min_beauty}+`);
          }

          // Affection requirement (Pokemon Amie/Refresh)
          if (detail.min_affection) {
            triggerData.minAffection = detail.min_affection;
            textParts.push(`Affection ${detail.min_affection}+`);
          }

          // Time of day
          if (detail.time_of_day) {
            triggerData.timeOfDay = detail.time_of_day;
            textParts.push(detail.time_of_day);
          }

          // Location requirement
          if (detail.location) {
            triggerData.location = detail.location.name;
            textParts.push(`at ${detail.location.name.replace(/-/g, " ")}`);
          }

          // Known move requirement
          if (detail.known_move) {
            triggerData.knownMove = detail.known_move.name;
            textParts.push(
              `knowing ${detail.known_move.name.replace(/-/g, " ")}`,
            );
          }

          // Known move type requirement
          if (detail.known_move_type) {
            triggerData.knownMoveType = detail.known_move_type.name;
            textParts.push(`knowing ${detail.known_move_type.name}-type move`);
          }

          // Gender requirement
          if (detail.gender !== null && detail.gender !== undefined) {
            triggerData.gender = detail.gender;
            const genderText = detail.gender === 1 ? "Female" : "Male";
            textParts.push(genderText);
          }

          // Rain requirement (Sliggoo -> Goodra)
          if (detail.needs_overworld_rain) {
            triggerData.needsOverworldRain = true;
            textParts.push("in rain");
          }

          // Turn upside down (Inkay -> Malamar)
          if (detail.turn_upside_down) {
            triggerData.turnUpsideDown = true;
            textParts.push("upside down");
          }

          // Physical stats comparison (Tyrogue evolutions)
          if (
            detail.relative_physical_stats !== null &&
            detail.relative_physical_stats !== undefined
          ) {
            triggerData.relativePhysicalStats = detail.relative_physical_stats;
            if (detail.relative_physical_stats === 1) {
              textParts.push("Atk > Def");
            } else if (detail.relative_physical_stats === -1) {
              textParts.push("Def > Atk");
            } else {
              textParts.push("Atk = Def");
            }
          }

          // Party species requirement (Mantyke -> Mantine needs Remoraid)
          if (detail.party_species) {
            triggerData.partySpecies = detail.party_species.name;
            textParts.push(`with ${detail.party_species.name} in party`);
          }

          // Party type requirement (Pancham -> Pangoro needs Dark-type)
          if (detail.party_type) {
            triggerData.partyType = detail.party_type.name;
            textParts.push(`with ${detail.party_type.name}-type in party`);
          }

          triggerText = textParts.join(", ");
          triggerData.text = triggerText;
        }

        // Add this evolution step to our chain
        evolutions.push({
          from: {
            id: pokemonDetailsFrom.id,
            name: chain.species.name,
            sprite: pokemonDetailsFrom.sprites.front_default,
          },
          to: {
            id: pokemonDetailsTo.id,
            name: evolution.species.name,
            sprite: pokemonDetailsTo.sprites.front_default,
          },
          trigger: triggerText ? triggerData : undefined,
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
      .replace(/\f/g, " ")
      .replace(/\u00ad\n/g, "")
      .replace(/\u00ad/g, "")
      .replace(/\n/g, " ");
  };

  // Get a random English flavor text
  const getRandomFlavorText = (species: any) => {
    if (
      !species ||
      !species.flavor_text_entries ||
      !species.flavor_text_entries.length
    )
      return "";

    const englishEntries = species.flavor_text_entries.filter(
      (entry: any) => entry.language.name === "en",
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

      const animatedGen5 =
        response?.sprites.versions?.["generation-v"]?.["black-white"].animated
          .front_default;
      const showdownSprite = response?.sprites.other?.showdown?.front_default;
      const defaultSprite = response?.sprites.front_default;

      setSprite(
        animatedGen5 ||
          defaultSprite ||
          showdownSprite ||
          `${POKEMON_SHOWDOWN_IMAGE}/${response?.id}.gif`,
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
      const speciesIdentifier = response?.species?.name || response?.id;
      loadSpeciesData(speciesIdentifier);

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
      setVarieties(speciesData?.varieties || []);

      // Set additional species data
      setEggGroups(speciesData?.egg_groups?.map((eg: any) => eg.name) || []);
      setHabitat(speciesData?.habitat?.name || "");
      setGrowthRate(speciesData?.growth_rate?.name || "");
      setGeneration(speciesData?.generation?.name || "");
      setIsLegendary(speciesData?.is_legendary || false);
      setIsMythical(speciesData?.is_mythical || false);
      setShape(speciesData?.shape?.name || "");
      setColor(speciesData?.color?.name || "");
      setHatchCounter(speciesData?.hatch_counter || 0);
      setGenderRate(speciesData?.gender_rate ?? -1);

      // Extract generation number from URL and load related Pokémon
      if (speciesData && speciesData.generation && speciesData.generation.url) {
        const genNumber = speciesData.generation.url
          .split("/")
          .filter(Boolean)
          .pop();
        loadRelatedPokemon(genNumber);
      } else {
        // Fallback to generation 1 if we can't determine generation
        loadRelatedPokemon(1);
      }

      // Get evolution chain if available
      if (
        speciesData &&
        speciesData.evolution_chain &&
        speciesData.evolution_chain.url
      ) {
        const evolutionData = await getEvolutionChain(
          speciesData.evolution_chain.url,
        );

        if (evolutionData) {
          const processedEvolutions =
            await processEvolutionChain(evolutionData);
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

  // Attempt to catch Pokemon using server-side Game Mechanics
  async function attemptCatchPokemon(): Promise<CatchAttemptResultDto | null> {
    if (!isAuthenticated) {
      toast.error("Please log in to catch Pokémon!");
      return null;
    }

    try {
      const result = await collectionService.attemptCatch({
        pokemonApiId: pokemonId,
        caughtLocation: "Wild",
        pokeballType: PokeballType.Pokeball, // Default to regular Pokeball
        nickname: nickname.trim() || undefined,
      });

      return result;
    } catch (error: any) {
      console.error("Error attempting catch:", error);
      toast.error(error.response?.data?.message || "Failed to attempt catch");
      return null;
    }
  }

  // Simulate shake animation based on server shake count
  async function animateShakes(shakes: number): Promise<void> {
    return new Promise((resolve) => {
      let currentShake = 0;
      const shakeInterval = window.setInterval(() => {
        currentShake++;
        setShakeCount(currentShake);

        if (currentShake >= shakes || currentShake >= 3) {
          window.clearInterval(shakeInterval);
          resolve();
        }
      }, 600);
    });
  }

  async function throwPokeball() {
    if (!isAuthenticated) {
      toast.error("Please log in to catch Pokémon!");
      return;
    }

    setIsCatching(true);
    setShakeCount(0);
    setIsPokemonFled(false);
    setCatchAttemptResult(null);
    setCaughtPokemonData(null);

    // Call server to attempt catch
    const result = await attemptCatchPokemon();

    if (!result) {
      setIsCatching(false);
      return;
    }

    setCatchAttemptResult(result);
    setCatchRatePercentState(result.catchRatePercent);

    // Animate shakes based on server result
    await animateShakes(result.shakeCount);

    setIsCatching(false);
    setIsEndPhase(true);

    if (result.result === CatchAttemptResult.Success) {
      setIsCaught(true);
      setCaughtPokemonData(result.caughtPokemon);

      // Show trainer XP gained
      if (result.trainerExpGained > 0) {
        toast.success(`+${result.trainerExpGained} Trainer XP!`, {
          duration: 2000,
        });
      }
    } else if (result.result === CatchAttemptResult.Fled) {
      setIsCaught(false);
      setIsPokemonFled(true);
    } else {
      setIsCaught(false);
      // Show some XP was still gained on failure
      if (result.trainerExpGained > 0) {
        toast(`+${result.trainerExpGained} XP for trying!`, {
          duration: 2000,
          icon: "💪",
        });
      }
    }

    if (throwBallTimeout.current)
      clearTimeout(throwBallTimeout.current as number);

    throwBallTimeout.current = setTimeout(() => {
      setIsEndPhase(false);
      if (result.result === CatchAttemptResult.Success) {
        // Pokemon caught - show success modal with details
        setCatchResult({
          ivTotal: result.caughtPokemon?.ivTotal,
          ivRating: result.caughtPokemon?.rankDisplay,
          isNewSpecies: result.isNewSpecies,
          experienceGained: result.trainerExpGained,
        });
        setNicknameModal(true);
      } else if (result.result === CatchAttemptResult.Fled) {
        // Pokemon fled - cannot try again
        toast.error(`${name?.toUpperCase()} fled!`, {
          duration: 3000,
          icon: "💨",
        });
      }
      // Escaped - user can try again
    }, 1500);
  }

  async function onNicknameSave(e: FormEvent) {
    e.preventDefault();

    // Pokemon is already caught from server, we just update nickname if provided
    if (!catchAttemptResult || !caughtPokemonData) {
      toast.error("No caught Pokémon data available");
      return;
    }

    setIsSaving(true);

    try {
      // If user wants to update nickname after catch
      if (nickname.trim() && nickname.trim() !== caughtPokemonData.nickname) {
        try {
          const response = await collectionService.updateNickname(
            caughtPokemonData.id,
            nickname.trim(),
          );
          if (response && response.nickname) {
            setNickname(response.nickname);
            // Verify we update the local data as well so the "Whoosh!" screen shows correct name
            if (caughtPokemonData)
              caughtPokemonData.nickname = response.nickname;
          }
        } catch (error: any) {
          console.error("Error updating nickname:", error);
          // Don't fail the whole process, just show warning
          toast.error("Failed to update nickname, but Pokémon was saved!");
        }
      }

      // Refresh pokeSummary from API to update captured status
      await refreshPokeSummary();

      // Main catch notification with rank
      const pokemon = caughtPokemonData;
      const isShiny = pokemon?.isShiny;
      const rank = pokemon?.rankDisplay;

      toast.success(
        isShiny
          ? `✨ Shiny ${pokemon?.displayName} caught! ${rank}`
          : `${pokemon?.displayName} was caught! ${rank}`,
        { duration: 4000 },
      );

      if (catchAttemptResult.isNewSpecies) {
        toast.success("📖 New species registered in Pokédex!", {
          duration: 3000,
        });
      }

      if (catchAttemptResult.trainerLeveledUp) {
        toast.success(
          `🎉 Trainer leveled up to ${catchAttemptResult.newTrainerLevel}!`,
          { duration: 3000 },
        );
      }

      setIsSaved(true);
    } catch (error: any) {
      console.error("Error in nickname save:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsSaving(false);
    }
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
          const formattedName = name.toLowerCase().replace("-", "");
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
    setImageError(false);
    setFallbackLevel(0);
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
    audioRef.addEventListener("timeupdate", handleTimeUpdate);
    audioRef.addEventListener("loadedmetadata", handleLoadedMetadata);
    audioRef.addEventListener("ended", handleEnded);

    // Clean up event listeners
    return () => {
      audioRef.removeEventListener("timeupdate", handleTimeUpdate);
      audioRef.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audioRef.removeEventListener("ended", handleEnded);
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
          <div style={{ display: "grid", placeItems: "center", gap: "12px" }}>
            <LazyLoadImage
              className={`pokeball ${shakeCount > 0 ? "shaking" : ""}`}
              src="/static/pokeball.png"
              alt="pokeball"
              width={128}
              height={128}
            />
            {/* Shake indicators */}
            <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
              {[1, 2, 3].map((shake) => (
                <div
                  key={shake}
                  style={{
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    backgroundColor:
                      shakeCount >= shake ? "#4ade80" : "#374151",
                    transition: "background-color 0.3s ease",
                    boxShadow: shakeCount >= shake ? "0 0 8px #4ade80" : "none",
                  }}
                />
              ))}
            </div>
            <Text variant="outlined" size="xl">
              {shakeCount === 0 ? "Throwing..." : `Shake ${shakeCount}...`}
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

              <LazyLoadImage
                src="/static/pokeball.png"
                alt="pokeball"
                width={128}
                height={128}
              />
              <Text variant="outlined" size="xl">
                {isPokemonFled
                  ? `${name?.toUpperCase()} fled!`
                  : catchAttemptResult?.message ||
                    `Oh no, ${name?.toUpperCase()} broke free!`}
              </Text>
              {!isPokemonFled && catchRatePercent > 0 && (
                <Text size="sm" style={{ color: "#9CA3AF", marginTop: "8px" }}>
                  Catch rate was {catchRatePercent.toFixed(1)}%
                </Text>
              )}
            </T.PostCatchModal>
          </Modal>
          <Modal open={isCaught} overlay="light">
            <T.PostCatchModal>
              <T.ImageContainer>
                <PokemonAvatar
                  src={
                    caughtPokemonData?.isShiny
                      ? caughtPokemonData?.spriteUrl || sprite
                      : sprite
                  }
                  alt={name}
                  width={320}
                  height={320}
                  effect="blur"
                  loading="lazy"
                  className="pokemon-dt"
                />
              </T.ImageContainer>

              <LazyLoadImage
                src="/static/pokeball.png"
                alt="pokeball"
                width={128}
                height={128}
              />
              <Text variant="outlined" size="xl">
                {caughtPokemonData?.isShiny ? "✨ " : ""}
                Gotcha! {name?.toUpperCase()} was caught!
              </Text>
              {caughtPokemonData && (
                <div style={{ marginTop: "12px", textAlign: "center" }}>
                  <Text size="sm" style={{ color: "#60A5FA" }}>
                    Level {caughtPokemonData.level} •{" "}
                    {caughtPokemonData.rankDisplay}
                  </Text>
                </div>
              )}
            </T.PostCatchModal>
          </Modal>
        </>
      )}

      <Modal open={nicknameModal} overlay="light" solid>
        <T.NicknamingModal>
          <T.ImageContainer>
            <PokemonAvatar
              src={
                caughtPokemonData?.isShiny
                  ? caughtPokemonData?.spriteUrl || sprite
                  : sprite
              }
              alt={name}
              width={320}
              height={320}
              effect="blur"
              loading="lazy"
              className="pokemon-dt"
            />
            {caughtPokemonData?.isShiny && (
              <Text size="sm" style={{ color: "#FBBF24", marginTop: "8px" }}>
                ✨ SHINY! ✨
              </Text>
            )}
          </T.ImageContainer>

          {!isSaved ? (
            <T.NicknamingForm onSubmit={onNicknameSave}>
              <div className="pxl-border" style={{ textAlign: "left" }}>
                <Text>Congratulations!</Text>
                <Text>
                  You just caught a{" "}
                  {caughtPokemonData?.displayName || name?.toUpperCase()}!
                </Text>

                {/* Show caught Pokemon details */}
                {caughtPokemonData && (
                  <div
                    style={{
                      marginTop: 12,
                      padding: "8px 0",
                      borderTop: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <Text size="sm" style={{ color: "#9CA3AF" }}>
                      Level {caughtPokemonData.level} •{" "}
                      {caughtPokemonData.rankDisplay}
                    </Text>
                    <Text size="sm" style={{ color: "#60A5FA", marginTop: 4 }}>
                      Best stat: {caughtPokemonData.bestStatName} (
                      {caughtPokemonData.bestStatIv} IV)
                    </Text>
                    <Text size="sm" style={{ color: "#9CA3AF", marginTop: 4 }}>
                      {caughtPokemonData.ivVerdict}
                    </Text>
                  </div>
                )}

                <br />
                <Text>Give {name?.toUpperCase()} a nickname? (optional)</Text>
              </div>

              <Input
                placeholder={
                  caughtPokemonData?.nickname || "enter a nickname (optional)"
                }
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setNickname(e.target.value.toUpperCase())
                }
                disabled={isSaving}
              />

              <Button type="submit" disabled={isSaving}>
                {isSaving
                  ? "Saving..."
                  : nickname.trim()
                    ? "Save with Nickname"
                    : "Keep Original Name"}
              </Button>
            </T.NicknamingForm>
          ) : (
            <T.AnotherWrapper>
              <div className="pxl-border" style={{ textAlign: "left" }}>
                <Text>
                  Whoosh! {nickname || caughtPokemonData?.displayName} is now in
                  your Pokémon list!
                </Text>

                {caughtPokemonData && (
                  <div style={{ marginTop: 12, padding: "8px 0" }}>
                    <Text size="sm" style={{ color: "#60A5FA" }}>
                      ⭐ {caughtPokemonData.rankDisplay} (
                      {caughtPokemonData.ivTotal}/186 IV)
                    </Text>
                    {catchResult?.experienceGained &&
                      catchResult.experienceGained > 0 && (
                        <Text
                          size="sm"
                          style={{ color: "#34D399", marginTop: 4 }}
                        >
                          +{catchResult.experienceGained} Trainer XP!
                        </Text>
                      )}
                    {catchResult?.isNewSpecies && (
                      <Text
                        size="sm"
                        style={{ color: "#FBBF24", marginTop: 4 }}
                      >
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

        <T.PokeName
          style={{
            background:
              types.length > 0
                ? `linear-gradient(to right, ${skillColor[`${types[0]}-200`] || "#A8A77A"}, transparent)`
                : undefined,
          }}
        >
          <Text as="h1" variant="outlined" size="xl">
            {name}
          </Text>
          <Text as="h2" variant="outlined" size="base" className="genera-text">
            {(species &&
              species.genera &&
              species.genera.find((g: any) => g.language.name === "en")
                ?.genus) ||
              ""}
          </Text>
        </T.PokeName>

        <T.PokemonContainer>
          <div
            className="img-pokemon"
            style={{ display: "flex", justifyContent: "center" }}
          >
            {!isLoading ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {/* Classification Badge */}
                {(isLegendary || isMythical) && (
                  <T.ClassificationText
                    isLegendary={isLegendary}
                    isMythical={isMythical}
                  >
                    {isLegendary ? "Legendary" : "Mythical"}
                  </T.ClassificationText>
                )}
                {/* Pokemon Image */}
                <T.PokemonImageWrapper>
                  <PokemonAvatar
                    src={
                      fallbackLevel === 2
                        ? "/substitute.png"
                        : imageError || fallbackLevel === 1 // If explicit error or level 1
                          ? `${POKEMON_SHOWDOWN_IMAGE}/${pokemonId}.gif`
                          : sprite
                    }
                    alt={name}
                    width={256}
                    height={256}
                    effect="blur"
                    loading="lazy"
                    className="pokemon-dt"
                    onError={() => {
                      // Level 0 -> 1 (Showdown)
                      if (fallbackLevel === 0) setFallbackLevel(1);
                      // Level 1 -> 2 (Substitute)
                      else if (fallbackLevel === 1) setFallbackLevel(2);

                      setImageError(true);
                    }}
                    key={`detail-${pokemonId}-${fallbackLevel}`}
                    style={
                      fallbackLevel === 2
                        ? {
                            transform: "scale(0.8)",
                          }
                        : undefined
                    }
                  />
                </T.PokemonImageWrapper>
                {/* Type Icons */}
                <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
                  {types &&
                    types.map((type: string, index: number) => (
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
                <Text style={{ fontSize: "0.75rem", color: "#6B7280" }}>
                  {Math.round((captureRate / 255) * 100)}% at full health
                </Text>
              </div>
              <div className="info-item">
                <Text className="info-label">Base Happiness</Text>
                <Text className="info-value">{baseHappiness}</Text>
              </div>
            </T.InfoSection>
            <div
              className="info-item"
              style={{
                alignItems: "center",
                justifyContent: "left",
                paddingTop: "12px",
                display: "flex",
                flexDirection: "row",
              }}
            >
              <button
                onClick={playPokemonCry}
                disabled={isPlayingCry}
                style={{
                  background: isPlayingCry
                    ? `rgba(255, 255, 255, 0.3)`
                    : "rgba(255, 255, 255, 0.15)",
                  border: "2px solid rgba(100, 100, 100, 0.3)",
                  borderRadius: "50%",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "12px",
                  transition: "all 0.3s ease",
                  boxShadow: isPlayingCry
                    ? "0 0 8px 2px rgba(255, 255, 255, 0.6)"
                    : "none",
                  width: "60px",
                  height: "60px",
                }}
                title="Play Pokémon cry"
              >
                {isPlayingCry ? (
                  <svg
                    width="36"
                    height="36"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Pokeball-themed sound icon (playing) */}
                    <circle cx="12" cy="12" r="10" fill="#FF5555" />
                    <path
                      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z"
                      fill="white"
                    />
                    <path
                      d="M12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z"
                      fill="white"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M2 12C2 6.48 6.48 2 12 2V4C7.58 4 4 7.58 4 12H2Z"
                      fill="#FFF"
                    >
                      <animate
                        attributeName="opacity"
                        values="1;0.5;1"
                        dur="1s"
                        repeatCount="indefinite"
                      />
                    </path>
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C17.52 2 22 6.48 22 12H20C20 7.58 16.42 4 12 4V2Z"
                      fill="#FFF"
                    >
                      <animate
                        attributeName="opacity"
                        values="1;0.5;1"
                        dur="1s"
                        repeatCount="indefinite"
                      />
                    </path>
                    {/* Sound waves */}
                    <path
                      d="M16 8C17.1 8.9 18 10.4 18 12C18 13.6 17.1 15.1 16 16"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <animate
                        attributeName="opacity"
                        values="1;0.3;1"
                        dur="1s"
                        repeatCount="indefinite"
                      />
                    </path>
                  </svg>
                ) : (
                  <svg
                    width="36"
                    height="36"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Pokeball-themed sound icon (not playing) */}
                    <path
                      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z"
                      fill="#333"
                    />
                    <path
                      d="M12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z"
                      fill="#333"
                    />
                    <path
                      d="M2 12C2 6.48 6.48 2 12 2V4C7.58 4 4 7.58 4 12H2Z"
                      fill="#FF5555"
                    />
                    <path
                      d="M12 2C17.52 2 22 6.48 22 12H20C20 7.58 16.42 4 12 4V2Z"
                      fill="#FF5555"
                    />
                    {/* Sound waves */}
                    <path
                      d="M16 8C17.1 8.9 18 10.4 18 12C18 13.6 17.1 15.1 16 16"
                      stroke="#333"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
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
                          backgroundColor:
                            index % 2 === 0
                              ? "rgba(255, 255, 255, 0.8)"
                              : "rgba(255, 255, 255, 0.5)",
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
              className={`tab ${activeTab === "about" ? "active" : ""}`}
              onClick={() => setActiveTab("about")}
            >
              <Text>About</Text>
            </div>
            <div
              className={`tab ${activeTab === "stats" ? "active" : ""}`}
              onClick={() => setActiveTab("stats")}
            >
              <Text>Stats</Text>
            </div>
            <div
              className={`tab ${activeTab === "training" ? "active" : ""}`}
              onClick={() => setActiveTab("training")}
            >
              <Text>Training</Text>
            </div>
            <div
              className={`tab ${activeTab === "breeding" ? "active" : ""}`}
              onClick={() => setActiveTab("breeding")}
            >
              <Text>Breeding</Text>
            </div>
            <div
              className={`tab ${activeTab === "evolution" ? "active" : ""}`}
              onClick={() => setActiveTab("evolution")}
            >
              <Text>Evolution</Text>
            </div>
            <div
              className={`tab ${activeTab === "moves" ? "active" : ""}`}
              onClick={() => setActiveTab("moves")}
            >
              <Text>Moves</Text>
            </div>
            <div
              className={`tab ${activeTab === "sprites" ? "active" : ""}`}
              onClick={() => setActiveTab("sprites")}
            >
              <Text>Sprites</Text>
            </div>
            <div
              className={`tab ${activeTab === "varieties" ? "active" : ""}`}
              onClick={() => setActiveTab("varieties")}
            >
              <Text>Varieties</Text>
            </div>
          </T.TabsContainer>

          {/* About Tab */}
          {activeTab === "about" && (
            <AboutTab
              abilities={abilities}
              relatedPokemon={relatedPokemon}
              specialForms={specialForms}
              isLoadingRelated={isLoadingRelated}
              species={species}
              name={name}
              heldItems={heldItems}
              habitat={habitat}
              color={color}
              shape={shape}
              generation={generation}
              isLegendary={isLegendary}
              isMythical={isMythical}
            />
          )}

          {/* Stats Tab */}
          {activeTab === "stats" && <StatsTab stats={stats} />}

          {/* Training Tab */}
          {activeTab === "training" && (
            <TrainingTab
              stats={stats}
              baseExperience={baseExperience}
              captureRate={captureRate}
              baseHappiness={baseHappiness}
              growthRate={growthRate}
            />
          )}

          {/* Breeding Tab */}
          {activeTab === "breeding" && (
            <BreedingTab
              eggGroups={eggGroups}
              genderRate={genderRate}
              hatchCounter={hatchCounter}
              baseHappiness={baseHappiness}
            />
          )}

          {/* Evolution Tab */}
          {activeTab === "evolution" && (
            <EvolutionTab
              isLoadingEvolution={isLoadingEvolution}
              evolutionChain={evolutionChain}
            />
          )}

          {/* Moves Tab */}
          {activeTab === "moves" && <MovesTab moves={moves} types={types} />}

          {/* Sprites Tab */}
          {activeTab === "sprites" && (
            <SpritesTab sprites={sprites} name={name} />
          )}

          {/* Varieties Tab */}
          {activeTab === "varieties" && (
            <VarietiesTab varieties={varieties} currentPokemonName={name} />
          )}
        </T.Content>
      </T.Page>

      <Navbar ref={navRef} fadeHeight={224}>
        {!isLoading && (
          <>
            {!isAuthenticated ? (
              <Link to="/login">
                <Button variant="dark" size="xl" icon="/static/pokeball.png">
                  Login to Catch
                </Button>
              </Link>
            ) : isPokemonFled ? (
              <Button
                variant="dark"
                size="xl"
                disabled
                icon="/static/pokeball.png"
              >
                Pokémon Fled
              </Button>
            ) : isSaved ? (
              <Link to="/pokemons">
                <Button variant="dark" size="xl" icon="/static/pokeball.png">
                  Find Another
                </Button>
              </Link>
            ) : (
              <Button
                variant="dark"
                onClick={() => throwPokeball()}
                size="xl"
                disabled={isCatching}
                icon="/static/pokeball.png"
              >
                {isCatching ? "Catching..." : "Catch"}
              </Button>
            )}
          </>
        )}
      </Navbar>
    </>
  );
};

export default DetailPokemon;
