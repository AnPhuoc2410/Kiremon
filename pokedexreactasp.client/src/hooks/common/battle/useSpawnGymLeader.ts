import { useCallback, useState } from "react";
import {
  GYM_LEADERS,
  getGymLeaderOrDefault,
  IGymLeader,
  IGymPokemon,
} from "@/constants/gymLeaders";

export const LS_GYM_BATTLE_KEY = "pokegames@gym-battle";

interface IGymBattleState {
  leaderId: string;
  activeEnemyIndex: number;
  roster: IGymPokemon[];
}

export const useSpawnGymLeader = (leaderId: string) => {
  const getSavedGymBattle = (): IGymBattleState | null => {
    if (typeof window === "undefined") return null;
    const saved = localStorage.getItem(LS_GYM_BATTLE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as IGymBattleState;
        if (parsed.leaderId === leaderId) {
          return parsed;
        }
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  const [battleState, setBattleState] = useState<IGymBattleState | null>(() => {
    const saved = getSavedGymBattle();
    if (saved) return saved;

    if (!leaderId) return null;

    const leader = getGymLeaderOrDefault(leaderId);
    // Initialize roster HPs
    const rosterWithHps = leader.roster.map((p) => ({
      ...p,
      current_hp: p.stats.hp,
      is_defeated: false,
    })) as any[];

    const newState = {
      leaderId,
      activeEnemyIndex: 0,
      roster: rosterWithHps,
    };

    localStorage.setItem(LS_GYM_BATTLE_KEY, JSON.stringify(newState));
    return newState;
  });

  const updateRosterPokemon = useCallback(
    (
      index: number,
      updates: Partial<
        IGymPokemon & { current_hp: number; is_defeated: boolean }
      >,
    ) => {
      setBattleState((prev) => {
        if (!prev) return null;
        const updatedRoster = prev.roster.map((p, i) =>
          i === index ? { ...p, ...updates } : p,
        );
        const updatedState = { ...prev, roster: updatedRoster };
        localStorage.setItem(LS_GYM_BATTLE_KEY, JSON.stringify(updatedState));
        return updatedState;
      });
    },
    [],
  );

  const sendNextPokemon = useCallback((): boolean => {
    let succeeded = false;
    setBattleState((prev) => {
      if (!prev) return null;
      if (prev.activeEnemyIndex + 1 < prev.roster.length) {
        const updatedState = {
          ...prev,
          activeEnemyIndex: prev.activeEnemyIndex + 1,
        };
        localStorage.setItem(LS_GYM_BATTLE_KEY, JSON.stringify(updatedState));
        succeeded = true;
        return updatedState;
      }
      return prev;
    });
    return succeeded;
  }, []);

  const clearGymBattle = useCallback(() => {
    localStorage.removeItem(LS_GYM_BATTLE_KEY);
    setBattleState(null);
  }, []);

  const leader = leaderId ? getGymLeaderOrDefault(leaderId) : null;
  const activeEnemy = battleState
    ? (battleState.roster[battleState.activeEnemyIndex] as any)
    : null;

  return {
    leader,
    activeEnemy,
    enemyRoster: battleState?.roster || [],
    activeEnemyIndex: battleState?.activeEnemyIndex ?? 0,
    updateRosterPokemon,
    sendNextPokemon,
    clearGymBattle,
    isLoading: !battleState && !!leaderId,
  };
};
