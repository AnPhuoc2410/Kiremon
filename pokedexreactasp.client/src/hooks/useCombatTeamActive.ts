import { useCallback, useEffect, useState } from "react";

import { ICombatPokemon, ICombatTeam } from "@/types/pokemon";

export const COMBAT_TEAM_STORAGE_KEY = "pokegames@combatTeam";
export const MAX_COMBAT_TEAM_SIZE = 6;

const EMPTY_TEAM: ICombatTeam = {
  active: [],
  dream: [],
  storage: [],
};

function parseCombatTeam(raw: string | null): ICombatTeam {
  if (!raw) return EMPTY_TEAM;

  try {
    const parsed = JSON.parse(raw) as Partial<ICombatTeam>;
    return {
      active: Array.isArray(parsed.active) ? parsed.active : [],
      dream: Array.isArray(parsed.dream) ? parsed.dream : [],
      storage: Array.isArray(parsed.storage) ? parsed.storage : [],
    };
  } catch {
    return EMPTY_TEAM;
  }
}

function readActiveTeam(): ICombatPokemon[] {
  if (typeof window === "undefined") return [];
  const team = parseCombatTeam(localStorage.getItem(COMBAT_TEAM_STORAGE_KEY));
  return team.active.slice(0, MAX_COMBAT_TEAM_SIZE);
}

export function useCombatTeamActive() {
  const [activeTeam, setActiveTeam] = useState<ICombatPokemon[]>(readActiveTeam);

  const refresh = useCallback(() => {
    setActiveTeam(readActiveTeam());
  }, []);

  useEffect(() => {
    refresh();

    const onStorage = (event: StorageEvent) => {
      if (event.key === COMBAT_TEAM_STORAGE_KEY) {
        refresh();
      }
    };

    const onVisible = () => {
      if (document.visibilityState === "visible") {
        refresh();
      }
    };

    window.addEventListener("storage", onStorage);
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      window.removeEventListener("storage", onStorage);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [refresh]);

  return { activeTeam, refresh };
}
