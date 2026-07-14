import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { ICombatPokemon, ICombatTeam } from "@/types/pokemon";
import { collectionService } from "@/services";
import { UserPokemonDto } from "@/types/userspokemon.types";

export const MAX_TEAM_SIZE = 6;

// localStorage key for dream team (wishlist) only — active/storage come from BE
const DREAM_TEAM_KEY = "pokegames@dreamTeam";

const DEFAULT_TEAM: ICombatTeam = { active: [], dream: [], storage: [] };

const FALLBACK_STATS = (names: string[]) =>
  names.map((name) => ({
    base_stat: 0,
    effort: 0,
    stat: { name, url: "" },
  }));

/** Convert UserPokemonDto (BE) → ICombatPokemon (FE local format) */
function toBattlePokemon(p: UserPokemonDto): ICombatPokemon {
  return {
    id: p.id,
    name: p.nickname || p.displayName,
    originalName: p.name.toUpperCase(),
    sprite:
      p.spriteUrl ||
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png",
    types: [p.type1, ...(p.type2 ? [p.type2] : [])],
    stats: FALLBACK_STATS([
      "hp",
      "attack",
      "defense",
      "special-attack",
      "special-defense",
      "speed",
    ]).map((s, i) => {
      const vals = [
        p.calculatedHp,
        p.calculatedAttack,
        p.calculatedDefense,
        p.calculatedSpecialAttack,
        p.calculatedSpecialDefense,
        p.calculatedSpeed,
      ];
      return { ...s, base_stat: vals[i] ?? 50 };
    }),
    abilities: p.abilities || [],
    moves: [],
    level: p.currentLevel || 50,
    experience: p.currentExperience || 100,
  };
}

function loadDreamTeam(): ICombatPokemon[] {
  try {
    const raw = localStorage.getItem(DREAM_TEAM_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function useTeamData(isAuthenticated: boolean) {
  const [teamData, setTeamData] = useState<ICombatTeam>(DEFAULT_TEAM);
  const [isLoading, setIsLoading] = useState(true);
  const [availablePokemon, setAvailablePokemon] = useState<ICombatPokemon[]>(
    [],
  );

  const loadFromServer = async () => {
    try {
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }

      const apiPokemon = await collectionService.getCollection();

      if (apiPokemon && apiPokemon.length > 0) {
        // Party = active team (BE: isInParty: true, sorted by slotIndex)
        const party = apiPokemon
          .filter((p) => p.isInParty)
          .sort((a, b) => a.slotIndex - b.slotIndex)
          .slice(0, MAX_TEAM_SIZE)
          .map(toBattlePokemon);

        // Storage = everything NOT in party, per box
        const storage = apiPokemon
          .filter((p) => !p.isInParty)
          .map(toBattlePokemon);

        // Dream team from localStorage (wishlist — user-set)
        const dream = loadDreamTeam();

        setTeamData({ active: party, dream, storage });
        setAvailablePokemon(storage);
      } else {
        // Not logged in or no pokemon caught — empty with persisted dream
        setTeamData({ active: [], dream: loadDreamTeam(), storage: [] });
      }
    } catch (error) {
      console.error("Error loading Pokemon from server:", error);
      toast.error("Couldn't load your Pokémon. Please refresh.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const safetyTimer = setTimeout(() => setIsLoading(false), 8000);
    loadFromServer();
    return () => clearTimeout(safetyTimer);
  }, [isAuthenticated]);

  // Persist dream team to localStorage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(DREAM_TEAM_KEY, JSON.stringify(teamData.dream));
    }
  }, [teamData.dream, isLoading]);

  /**
   * Move to dream team (local only — active/storage changes need boxService)
   */
  const addToDream = (pokemon: ICombatPokemon) => {
    if (teamData.dream.some((p) => p.id === pokemon.id)) {
      toast.error(`${pokemon.name} already in dream team.`);
      return;
    }
    if (teamData.dream.length >= MAX_TEAM_SIZE) {
      toast.error(`Dream team full! Max ${MAX_TEAM_SIZE}.`);
      return;
    }
    setTeamData((prev) => ({
      ...prev,
      dream: [...prev.dream, pokemon],
    }));
    toast.success(`${pokemon.name} added to dream team!`);
  };

  const removeFromDream = (pokemon: ICombatPokemon) => {
    setTeamData((prev) => ({
      ...prev,
      dream: prev.dream.filter((p) => p.id !== pokemon.id),
    }));
  };

  const movePokemon = (
    pokemon: ICombatPokemon,
    targetTeam: "active" | "dream" | "storage",
  ) => {
    if (targetTeam === "dream") {
      addToDream(pokemon);
      return;
    }
    // For active/storage — optimistic UI, but note real move needs boxService.movePokemon
    if (targetTeam === "active" && teamData.active.length >= MAX_TEAM_SIZE) {
      toast.error(`Active team full! Max ${MAX_TEAM_SIZE} Pokémon.`);
      return;
    }
    setTeamData((prev) => {
      const next = {
        active: prev.active.filter((p) => p.id !== pokemon.id),
        dream: prev.dream.filter((p) => p.id !== pokemon.id),
        storage: prev.storage.filter((p) => p.id !== pokemon.id),
      };
      next[targetTeam] = [...next[targetTeam], pokemon];
      const label = targetTeam === "active" ? "active team" : "storage";
      toast.success(`${pokemon.name} moved to ${label}.`);
      return next;
    });
  };

  const removePokemon = (
    pokemon: ICombatPokemon,
    sourceTeam: "active" | "dream" | "storage",
  ) => {
    if (sourceTeam === "dream") {
      removeFromDream(pokemon);
      return;
    }
    setTeamData((prev) => ({
      active:
        sourceTeam === "active"
          ? prev.active.filter((p) => p.id !== pokemon.id)
          : prev.active,
      dream: prev.dream,
      storage:
        sourceTeam === "storage"
          ? prev.storage.filter((p) => p.id !== pokemon.id)
          : [...prev.storage, pokemon],
    }));
    toast.success(`${pokemon.name} removed from ${sourceTeam} team.`);
  };

  const isInStorage = (pokemon: ICombatPokemon): boolean =>
    teamData.storage.some((p) => p.id === pokemon.id) ||
    teamData.active.some((p) => p.id === pokemon.id);

  const activateDreamTeam = () => {
    if (teamData.dream.length === 0) {
      toast.error("Dream team is empty!");
      return;
    }
    setTeamData((prev) => {
      const allOwned = [...prev.active, ...prev.storage];
      const newStorage = allOwned.filter(
        (owned) => !prev.dream.some((d) => d.id === owned.id),
      );
      toast.success("Dream team activated for battle!");
      return {
        ...prev,
        active: [...prev.dream],
        storage: newStorage,
      };
    });
  };

  return {
    teamData,
    setTeamData,
    isLoading,
    availablePokemon,
    setAvailablePokemon,
    movePokemon,
    removePokemon,
    isInStorage,
    activateDreamTeam,
    refresh: loadFromServer,
  };
}
