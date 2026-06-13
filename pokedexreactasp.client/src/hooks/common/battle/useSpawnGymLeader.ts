import { useCallback, useEffect, useState } from "react";
import {
  getGymLeaderOrDefault,
  IGymLeader,
  IGymPokemon,
} from "@/constants/gymLeaders";
import { battleService } from "@/services/battle/battle.service";
import { toAnimatedSprite } from "./battleHelpers";

export const useSpawnGymLeader = (leaderId: string) => {
  const [leader, setLeader] = useState<IGymLeader | null>(null);
  const [activeEnemyIndex, setActiveEnemyIndex] = useState<number>(0);
  const [enemyRoster, setEnemyRoster] = useState<IGymPokemon[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!leaderId) {
      setIsLoading(false);
      return;
    }

    const loadLeaderAndState = async () => {
      try {
        setIsLoading(true);
        // 1. Fetch gym leader metadata
        const leaderDto = await battleService.getGymLeader(leaderId);
        const roster: IGymPokemon[] = JSON.parse(leaderDto.rosterJson);

        const fullLeader: IGymLeader = {
          id: leaderDto.id,
          name: leaderDto.name,
          badgeName: leaderDto.badgeName,
          region: leaderDto.region,
          avatar: leaderDto.avatar,
          sprite: leaderDto.sprite,
          roster,
        };
        setLeader(fullLeader);

        // 2. Fetch saved battle state
        const savedState = await battleService.getBattleState(
          "gym_" + leaderId,
        );
        if (savedState) {
          setActiveEnemyIndex(savedState.activeEnemyIndex ?? 0);
          const gymRosterHps = savedState.gymRosterHps || [];
          const hydratedRoster = roster.map((p, idx) => ({
            ...p,
            sprite: toAnimatedSprite(p.sprite),
            current_hp:
              gymRosterHps[idx] !== undefined ? gymRosterHps[idx] : p.stats.hp,
            is_defeated:
              gymRosterHps[idx] !== undefined ? gymRosterHps[idx] <= 0 : false,
          }));
          setEnemyRoster(hydratedRoster);
        } else {
          setActiveEnemyIndex(0);
          const initialRoster = roster.map((p) => ({
            ...p,
            sprite: toAnimatedSprite(p.sprite),
            current_hp: p.stats.hp,
            is_defeated: false,
          }));
          setEnemyRoster(initialRoster);
        }
      } catch (e) {
        console.error("Failed to load gym leader from database/cache:", e);
        // Fallback if DB load fails
        const fallbackLeader = getGymLeaderOrDefault(leaderId);
        setLeader(fallbackLeader);
        setActiveEnemyIndex(0);
        const initialRoster = fallbackLeader.roster.map((p) => ({
          ...p,
          current_hp: p.stats.hp,
          is_defeated: false,
        }));
        setEnemyRoster(initialRoster);
      } finally {
        setIsLoading(false);
      }
    };

    loadLeaderAndState();
  }, [leaderId]);

  const updateRosterPokemon = useCallback(
    (index: number, updates: Partial<IGymPokemon>) => {
      setEnemyRoster((prev) => {
        return prev.map((p, idx) => (idx === index ? { ...p, ...updates } : p));
      });
    },
    [],
  );

  const sendNextPokemon = useCallback((): boolean => {
    let succeeded = false;
    setActiveEnemyIndex((prev) => {
      if (prev + 1 < enemyRoster.length) {
        succeeded = true;
        return prev + 1;
      }
      return prev;
    });
    return succeeded;
  }, [enemyRoster.length]);

  const clearGymBattle = useCallback(() => {
    setEnemyRoster([]);
    setActiveEnemyIndex(0);
  }, []);

  const activeEnemy = enemyRoster[activeEnemyIndex] || null;

  return {
    leader,
    activeEnemy,
    enemyRoster,
    activeEnemyIndex,
    updateRosterPokemon,
    sendNextPokemon,
    clearGymBattle,
    isLoading,
  };
};
