import { useCallback, useEffect, useState } from "react";
import type { IMyPokemon } from "@/types/pokemon";
import { usePokemonCore } from "@/hooks/queries/usePokemonCore";
import {
  getBaseStat,
  powerFromMoveName,
  scaleStat,
} from "@/components/utils/pokemon-utils";
import { battleService } from "@/services/battle/battle.service";

export const LS_ENEMY_KEY = "pokegames@vs-battle-enemy";

interface IUseSpawnEnemyReturn {
  enemy: IExtendedEnemy | null;
  isLoadingEnemy: boolean;
  clearEnemy: () => void;
  updateEnemyState: (updates: Partial<IExtendedEnemy>) => void;
}

interface ISpawnEnemyProps {
  userPokemon?: {
    level: number;
    experience: number;
  };
}

export interface IExtendedEnemy extends IMyPokemon {
  current_hp?: number;
  is_defeated?: boolean;
  sprite_back?: string;
  base_experience?: number;
  battle_state: {
    level: number;
    experience: number;
  };
  base_stats: {
    hp: number;
    attack: number;
    defense: number;
    special_attack: number;
    special_defense: number;
    speed: number;
  };
  stats: {
    hp: number;
    attack: number;
    defense: number;
    special_attack: number;
    special_defense: number;
    speed: number;
  };
  types: string[];
  moves: Array<{
    name: string;
    power: number;
    type: string;
  }>;
}

const getDifficultyParams = (playerLevel: number) => {
  if (playerLevel < 12) {
    return { statMultiplier: 1.0, minLevelAdd: -1, maxLevelAdd: 1 };
  }
  if (playerLevel < 20) {
    return { statMultiplier: 1.05, minLevelAdd: 0, maxLevelAdd: 2 };
  }
  if (playerLevel < 40) {
    return { statMultiplier: 1.08, minLevelAdd: 1, maxLevelAdd: 3 };
  }
  return { statMultiplier: 1.15, minLevelAdd: 2, maxLevelAdd: 4 };
};

export const useSpawnEnemy = ({
  userPokemon = { level: 1, experience: 0 },
}: ISpawnEnemyProps): IUseSpawnEnemyReturn => {
  const [enemy, setEnemy] = useState<IExtendedEnemy | null>(null);
  const [isLoadingCache, setIsLoadingCache] = useState<boolean>(true);
  const [randomId, setRandomId] = useState<string>("");
  const [randomLevel, setRandomLevel] = useState<number>(1);

  // 1. Load active wild battle state from Redis first
  useEffect(() => {
    const loadCache = async () => {
      try {
        setIsLoadingCache(true);
        const savedState = await battleService.getBattleState("wild");
        if (savedState && savedState.wildEnemy) {
          setEnemy(savedState.wildEnemy);
        } else {
          // No cached enemy: set random params to trigger PokeAPI fetch
          const id = Math.floor(Math.random() * 150 + 1).toString();
          const difficulty = getDifficultyParams(userPokemon.level);
          const min = Math.max(1, userPokemon.level + difficulty.minLevelAdd);
          const max = userPokemon.level + difficulty.maxLevelAdd;
          const lvl = Math.floor(Math.random() * (max - min + 1)) + min;

          setRandomId(id);
          setRandomLevel(lvl);
        }
      } catch (err) {
        console.error("Failed to load wild battle state from cache:", err);
      } finally {
        setIsLoadingCache(false);
      }
    };
    loadCache();
  }, [userPokemon.level]);

  const shouldFetch = !enemy && !isLoadingCache && !!randomId;
  const {
    detail: enemyData,
    isLoading: isLoadingEnemyData,
    localizedName,
  } = usePokemonCore(randomId, undefined, { enabled: shouldFetch });

  // 2. Hydrate newly spawned enemy once PokeAPI yields its data
  useEffect(() => {
    if (!shouldFetch || !enemyData || isLoadingEnemyData) return;

    const difficulty = getDifficultyParams(userPokemon.level);
    let rawHp = getBaseStat(enemyData as any, "hp");
    let rawAtk = getBaseStat(enemyData as any, "attack");
    let rawDef = getBaseStat(enemyData as any, "defense");
    let rawSpA = getBaseStat(enemyData as any, "special-attack");
    let rawSpD = getBaseStat(enemyData as any, "special-defense");
    let rawSpd = getBaseStat(enemyData as any, "speed");

    if (userPokemon.level < 12) {
      const MAX_ALLOWED_BST = 320;
      const currentBST = rawHp + rawAtk + rawDef + rawSpA + rawSpD + rawSpd;

      if (currentBST > MAX_ALLOWED_BST) {
        const ratio = MAX_ALLOWED_BST / currentBST;
        rawHp = Math.floor(rawHp * ratio);
        rawAtk = Math.floor(rawAtk * ratio);
        rawDef = Math.floor(rawDef * ratio);
        rawSpA = Math.floor(rawSpA * ratio);
        rawSpD = Math.floor(rawSpD * ratio);
        rawSpd = Math.floor(rawSpd * ratio);
      }
    }

    const applyStats = (base: number, isHp: boolean = false) => {
      let val = scaleStat(base, randomLevel);
      if (isHp) {
        val += randomLevel * 5 + 30;
      }
      return Math.floor(val * difficulty.statMultiplier);
    };

    const scaledStats = {
      hp: applyStats(rawHp, true),
      attack: applyStats(rawAtk),
      defense: applyStats(rawDef),
      special_attack: applyStats(rawSpA),
      special_defense: applyStats(rawSpD),
      speed: applyStats(rawSpd),
    };

    const typesBuild = enemyData.typeNames;
    const randomMoves = [...enemyData.moves]
      .sort(() => 0.5 - Math.random())
      .slice(0, 4);

    const pickedMoves = randomMoves.map((moveName: string, index: number) => {
      const assignedType = typesBuild[index % typesBuild.length] || "normal";
      return {
        name: moveName,
        power: powerFromMoveName(moveName),
        type: assignedType,
      };
    });

    const spritedFront = enemyData.sprite;
    const spritedBack =
      enemyData.sprites?.versions?.["generation-v"]?.["black-white"]?.animated
        ?.back_default || enemyData.sprites?.back_default;

    const newEnemy: IExtendedEnemy = {
      name: localizedName || randomId,
      nickname: (localizedName || randomId).toUpperCase(),
      sprite: spritedFront || "",
      sprite_back: spritedBack || "",
      base_experience: enemyData.baseExperience || 60,
      battle_state: { level: randomLevel, experience: 0 },
      base_stats: {
        hp: rawHp,
        attack: rawAtk,
        defense: rawDef,
        special_attack: rawSpA,
        special_defense: rawSpD,
        speed: rawSpd,
      },
      stats: scaledStats,
      types: typesBuild,
      moves: pickedMoves,
      current_hp: scaledStats.hp,
      is_defeated: false,
    };

    setEnemy(newEnemy);
  }, [
    enemyData,
    isLoadingEnemyData,
    shouldFetch,
    randomLevel,
    userPokemon.level,
    localizedName,
    randomId,
  ]);

  const updateEnemyState = useCallback((updates: Partial<IExtendedEnemy>) => {
    setEnemy((prev) => {
      if (!prev) return null;
      return { ...prev, ...updates };
    });
  }, []);

  const clearEnemy = useCallback(() => {
    setEnemy(null);
  }, []);

  return {
    enemy,
    isLoadingEnemy:
      isLoadingCache ||
      (shouldFetch && isLoadingEnemyData) ||
      (!enemy && !!randomId),
    clearEnemy,
    updateEnemyState,
  };
};
