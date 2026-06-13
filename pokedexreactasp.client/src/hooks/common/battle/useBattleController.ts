import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBattleMechanics } from "./useBattleMechanics";
import { usePokemonExperience } from "./usePokemonExperience";
import { useDamageSystem } from "./useDamageSystem";
import { userService } from "@/services/user/user.service";
import { collectionService } from "@/services/collection/collection.service";
import toast from "react-hot-toast";
import { battleService } from "@/services/battle/battle.service";
import { POKEMON_IMAGE } from "@/config/api.config";

interface IBattleControllerProps {
  playerPokemon: any;
  enemy: any;
  updateEnemyState: (updates: any) => void;
  key: {
    LS_PLAYER_HP_KEY: string;
    LS_ENEMY_KEY: string;
  };
  leaderId?: string;
  leader?: any;
  activeEnemy?: any;
  enemyRoster?: any[];
  activeEnemyIndex?: number;
  updateRosterPokemon?: (index: number, updates: any) => void;
  sendNextEnemy?: () => boolean;
  clearGymBattle?: () => void;
}

import {
  generateMovesForPokemon,
  getGymLeaderDefeatQuote,
} from "./battleHelpers";

const HIT_EFFECT_DURATION = 600;
const GAUGE_CHARGE_PER_HIT = 20;

export const useBattleController = ({
  playerPokemon,
  enemy,
  updateEnemyState,
  key,
  leaderId,
  leader,
  activeEnemy,
  enemyRoster = [],
  activeEnemyIndex = 0,
  updateRosterPokemon,
  sendNextEnemy,
  clearGymBattle,
}: IBattleControllerProps) => {
  const navigate = useNavigate();
  const isMounted = useRef<boolean>(true);

  // Unified roster battle states
  const [playerTeam, setPlayerTeam] = useState<any[]>([]);
  const [activePlayerIdx, setActivePlayerIdx] = useState<number>(0);
  const [playerTeamHps, setPlayerTeamHps] = useState<number[]>([]);

  const [playerCurrentHP, setPlayerCurrentHP] = useState<number>(0);
  const [enemyCurrentHP, setEnemyCurrentHP] = useState<number>(0);

  const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(true);
  const [isProcessingTurn, setIsProcessingTurn] = useState<boolean>(false);

  const [gameOver, setGameOver] = useState<boolean>(false);
  const [battleLog, setBattleLog] = useState<Array<string>>([]);

  const [ultimateGauge, setUltimateGauge] = useState<number>(0);
  const [enemyUltimateGauge, setEnemyUltimateGauge] = useState<number>(0);

  const [activeHitTarget, setActiveHitTarget] = useState<
    "player" | "enemy" | null
  >(null);
  const [hitKey, setHitKey] = useState<number>(0);
  const [showIntro, setShowIntro] = useState<boolean>(true);

  const { calculateDamage } = useBattleMechanics();
  const { addExp, calculateExpGain } = usePokemonExperience();
  const { damages, showDamage } = useDamageSystem();

  const isBattleInitialized = useRef(false);
  // Always-fresh ref to handleLose to avoid stale closures inside useCallback
  const handleLoseRef = useRef<((player?: any) => void) | null>(null);
  // Always-fresh ref to performEnemyTurn to avoid stale closures in player attack setTimeout
  const performEnemyTurnRef = useRef<(() => void) | null>(null);

  // Load player's combat team from database (isInParty) or fallback
  useEffect(() => {
    const fetchParty = async () => {
      try {
        const coll = await collectionService.getCollection();
        const party = coll
          .filter((p) => p.isInParty)
          .sort((a, b) => a.slotIndex - b.slotIndex);

        let activeTeam = party.map((p) => {
          const statsObj = {
            hp: p.calculatedHp || p.maxHp || 50,
            attack: p.calculatedAttack || 50,
            defense: p.calculatedDefense || 50,
            special_attack: p.calculatedSpecialAttack || 50,
            special_defense: p.calculatedSpecialDefense || 50,
            speed: p.calculatedSpeed || 50,
          };

          const generatedMoves = generateMovesForPokemon(
            p.name,
            p.type1,
            p.type2,
          );

          // Build animated sprite URLs using PokeAPI animated sprite convention
          const pokemonApiId = p.pokemonApiId;
          const animatedFront = pokemonApiId
            ? `${POKEMON_IMAGE}/versions/generation-v/black-white/animated/${pokemonApiId}.gif`
            : p.spriteUrl;
          const animatedBack = pokemonApiId
            ? `${POKEMON_IMAGE}/versions/generation-v/black-white/animated/back/${pokemonApiId}.gif`
            : p.spriteUrl;

          return {
            id: p.id,
            name: p.displayName || p.name,
            nickname: p.nickname || p.displayName || p.name,
            sprite: animatedFront || p.spriteUrl,
            sprite_back: animatedBack || p.spriteUrl,
            types: [p.type1, p.type2].filter(Boolean) as string[],
            stats: statsObj,
            level: p.currentLevel || 1,
            experience: p.currentExperience || 0,
            moves: generatedMoves,
          };
        });

        if (activeTeam.length === 0 && playerPokemon) {
          activeTeam = [playerPokemon];
        }

        setPlayerTeam(activeTeam);
        setPlayerTeamHps(activeTeam.map((p) => p.stats.hp));
      } catch (e) {
        console.error("Failed to load party from collection:", e);
      }
    };

    fetchParty();
  }, [playerPokemon]);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Initialize battle variables
  useEffect(() => {
    if (playerTeam.length === 0) return;
    if (isBattleInitialized.current) return;

    if (leaderId && (!activeEnemy || !leader)) return;
    if (!leaderId && !enemy) return;

    const initBattle = async () => {
      isBattleInitialized.current = true;
      const keyName = leaderId ? "gym_" + leaderId : "wild";

      try {
        const savedState = await battleService.getBattleState(keyName);

        // Check if saved state is stale: ended battle or corrupt HP data
        const isStaleState =
          savedState &&
          (savedState.gameOver === true ||
            savedState.playerCurrentHP <= 0 ||
            (Array.isArray(savedState.playerTeamHps) &&
              savedState.playerTeamHps.every((hp: number) => hp <= 0)));

        if (savedState && !isStaleState) {
          setActivePlayerIdx(savedState.activePlayerIdx);
          setPlayerTeamHps(savedState.playerTeamHps);
          setPlayerCurrentHP(savedState.playerCurrentHP);
          setEnemyCurrentHP(savedState.enemyCurrentHP);
          setIsPlayerTurn(savedState.isPlayerTurn);
          setBattleLog(savedState.battleLog);
          setUltimateGauge(savedState.ultimateGauge);
          setEnemyUltimateGauge(savedState.enemyUltimateGauge);
          setShowIntro(savedState.showIntro ?? false);
          setGameOver(false); // always start as not game-over when resuming

          if (
            leaderId &&
            savedState.activeEnemyIndex !== undefined &&
            updateRosterPokemon
          ) {
            const gymRosterHps = savedState.gymRosterHps || [];
            gymRosterHps.forEach((hp: number, idx: number) => {
              updateRosterPokemon(idx, {
                current_hp: hp,
                is_defeated: hp <= 0,
              });
            });
          }
        } else {
          // Stale or missing — clear and start fresh
          if (isStaleState) {
            try {
              await battleService.clearBattleState(keyName);
            } catch (_) {
              /* ignore */
            }
          }

          // Initialize fresh battle
          const initialPlayerHP = playerTeam[0].stats.hp;
          const initialEnemyHP = leaderId
            ? activeEnemy.stats.hp
            : enemy.stats.hp;

          let initialLog: string[] = [];
          if (leaderId) {
            initialLog = [
              `Gym Leader ${leader.name} challenged you to a battle!`,
              `${leader.name} sent out ${activeEnemy.name}!`,
              `Go, ${playerTeam[0].nickname}!`,
            ];
          } else {
            initialLog = [
              `Wild ${enemy.name} appeared!`,
              `Go, ${playerTeam[0].nickname}!`,
            ];
          }

          setPlayerCurrentHP(initialPlayerHP);
          setEnemyCurrentHP(initialEnemyHP);
          setBattleLog(initialLog);
          setUltimateGauge(0);
          setEnemyUltimateGauge(0);
          setShowIntro(true);
          setGameOver(false);

          const initialPlayerHps = playerTeam.map((p) => p.stats.hp);
          setPlayerTeamHps(initialPlayerHps);
          setActivePlayerIdx(0);

          const freshState: any = {
            activePlayerIdx: 0,
            playerTeamHps: initialPlayerHps,
            playerCurrentHP: initialPlayerHP,
            enemyCurrentHP: initialEnemyHP,
            isPlayerTurn: true,
            battleLog: initialLog,
            ultimateGauge: 0,
            enemyUltimateGauge: 0,
            showIntro: true,
            gameOver: false,
          };

          if (leaderId) {
            freshState.activeEnemyIndex = 0;
            freshState.gymRosterHps = enemyRoster.map((p) => p.stats.hp);
          } else {
            freshState.wildEnemy = enemy;
          }

          await battleService.saveBattleState(keyName, freshState);
        }
      } catch (err) {
        console.error("Error initializing battle state from backend:", err);
      }
    };

    initBattle();
  }, [
    playerTeam,
    enemy,
    activeEnemy,
    leaderId,
    leader,
    updateRosterPokemon,
    enemyRoster,
  ]);

  // Auto-save active battle state to Redis when dynamic state changes
  useEffect(() => {
    if (!isBattleInitialized.current || gameOver) return;

    const save = async () => {
      const keyName = leaderId ? "gym_" + leaderId : "wild";
      const stateToSave: any = {
        activePlayerIdx,
        playerTeamHps,
        playerCurrentHP,
        enemyCurrentHP,
        isPlayerTurn,
        battleLog,
        ultimateGauge,
        enemyUltimateGauge,
        showIntro,
        gameOver,
      };

      if (leaderId) {
        stateToSave.activeEnemyIndex = activeEnemyIndex;
        stateToSave.gymRosterHps = enemyRoster.map(
          (p) => p.current_hp ?? p.stats.hp,
        );
      } else {
        stateToSave.wildEnemy = enemy;
      }

      try {
        await battleService.saveBattleState(keyName, stateToSave);
      } catch (e) {
        console.error("Failed to auto-save battle state to Redis:", e);
      }
    };

    save();
  }, [
    activePlayerIdx,
    playerTeamHps,
    playerCurrentHP,
    enemyCurrentHP,
    isPlayerTurn,
    battleLog,
    ultimateGauge,
    enemyUltimateGauge,
    showIntro,
    gameOver,
    activeEnemyIndex,
    enemyRoster,
    leaderId,
    enemy,
  ]);

  const safeSetState = (setter: any, value: any) => {
    if (isMounted.current) setter(value);
  };

  const triggerHitEffect = (target: "player" | "enemy") => {
    if (!isMounted.current) return;
    setActiveHitTarget(target);
    setHitKey((prev) => prev + 1);
    setTimeout(() => {
      if (isMounted.current) setActiveHitTarget(null);
    }, HIT_EFFECT_DURATION);
  };

  const clearStorage = async (clearSpawnerState = true) => {
    const keyName = leaderId ? "gym_" + leaderId : "wild";
    try {
      await battleService.clearBattleState(keyName);
    } catch (err) {
      console.error("Failed to clear battle state from Redis:", err);
    }
    if (clearSpawnerState && clearGymBattle) clearGymBattle();
  };

  const currentEnemy = leaderId ? activeEnemy : enemy;
  const currentPlayer = playerTeam[activePlayerIdx] || playerPokemon;

  const handleWin = async () => {
    if (!currentEnemy || !currentPlayer) return;

    if (leaderId) {
      // Gym Leader Battle: check if there are more opponent Pokemon
      if (updateRosterPokemon) {
        updateRosterPokemon(activeEnemyIndex, {
          current_hp: 0,
          is_defeated: true,
        });
      }

      const hasNext = activeEnemyIndex + 1 < enemyRoster.length;
      if (hasNext && sendNextEnemy) {
        const nextOpponent = enemyRoster[activeEnemyIndex + 1];
        setBattleLog((prev) => [
          ...prev,
          `${currentEnemy.name} fainted!`,
          `Gym Leader ${leader.name} is sending out ${nextOpponent.name}!`,
        ]);
        sendNextEnemy();
        setEnemyCurrentHP(nextOpponent.stats.hp);
        setEnemyUltimateGauge(0);
        setIsProcessingTurn(false);
        return;
      }

      // Gym Leader is fully defeated!
      toast.loading("Recording achievement...", { id: "gym-win" });
      try {
        await userService.unlockAchievement(leaderId);
        toast.success(
          `Defeated ${leader.name}! ${leader.badgeName} unlocked!`,
          { id: "gym-win" },
        );
      } catch (err) {
        console.error("Failed to unlock achievement:", err);
        toast.error("Won battle, but failed to credit achievement on server", {
          id: "gym-win",
        });
      }

      const winLogs = [
        `Defeated Gym Leader ${leader.name}!`,
        `You earned the ${leader.badgeName}!`,
      ];
      safeSetState(setBattleLog, (prev: Array<string>) => [
        ...prev,
        ...winLogs,
      ]);
      safeSetState(setGameOver, true);
      setIsProcessingTurn(false);
      clearStorage(false);
    } else {
      // Wild Battle
      updateEnemyState({ current_hp: 0, is_defeated: true });

      const expReward = calculateExpGain(
        currentEnemy.battle_state.level,
        currentEnemy.base_experience || 60,
      );
      const result = addExp(currentPlayer.nickname, expReward);

      const winLogs = ["Enemy Fainted! You Win!", `Gained ${expReward} EXP.`];
      if (result.leveled) {
        winLogs.push(
          `${currentPlayer.nickname} grew to Level ${result.newLevel}!`,
          "Stats increased!",
        );
      }

      safeSetState(setBattleLog, (prev: Array<string>) => [
        ...prev,
        ...winLogs,
      ]);
      safeSetState(setGameOver, true);
      setIsProcessingTurn(false);
    }
  };

  const handleLose = (lostPlayer?: any) => {
    // Accept an optional snapshot of the current player to avoid stale-closure issues
    const playerSnapshot = lostPlayer || currentPlayer;
    if (!currentEnemy || !playerSnapshot) return;

    if (leaderId) {
      const defeatQuote = getGymLeaderDefeatQuote(leader.name);
      const loseLogs = [
        "Your team fainted...",
        `Gym Leader ${leader.name}: "${defeatQuote}"`,
        `Gym Leader ${leader.name} won the battle!`,
      ];
      safeSetState(setBattleLog, (prev: Array<string>) => [
        ...prev,
        ...loseLogs,
      ]);
      safeSetState(setGameOver, true);
      setIsProcessingTurn(false);
      clearStorage(false); // Clear Redis state but preserve spawner state for the UI
    } else {
      const baseExp = currentEnemy.base_experience || 60;
      const partialExp = Math.floor(
        calculateExpGain(currentEnemy.battle_state.level, baseExp) / 4,
      );
      const result = addExp(playerSnapshot.nickname, partialExp);

      const loseLogs = [
        `${playerSnapshot.nickname} Fainted...`,
        `Gained ${partialExp} EXP.`,
      ];
      if (result.leveled) {
        loseLogs.push(
          `${playerSnapshot.nickname} grew to Level ${result.newLevel}!`,
        );
      }

      safeSetState(setBattleLog, (prev: Array<string>) => [
        ...prev,
        ...loseLogs,
      ]);
      safeSetState(setGameOver, true);
      updateEnemyState({
        current_hp: currentEnemy.stats.hp,
        is_defeated: false,
      });
      setIsProcessingTurn(false);
      clearStorage(false); // Clear Redis state but preserve spawner state for the UI
    }
  };

  // Keep handleLoseRef up-to-date every render (defined above, so safe to assign here)
  handleLoseRef.current = handleLose;

  // --- ENEMY TURN ---
  const performEnemyTurn = useCallback(() => {
    console.log(
      "[useBattleController] performEnemyTurn initial checks - currentPlayer:",
      currentPlayer?.nickname,
      "playerCurrentHP:",
      playerCurrentHP,
      "activePlayerIdx:",
      activePlayerIdx,
      "enemy:",
      currentEnemy?.name,
      "gameOver:",
      gameOver,
      "isMounted:",
      isMounted.current,
    );
    if (gameOver || !currentEnemy || !currentPlayer || !isMounted.current) {
      console.log(
        "[useBattleController] performEnemyTurn early return. Conditions: gameOver:",
        gameOver,
        "currentEnemy:",
        !!currentEnemy,
        "currentPlayer:",
        !!currentPlayer,
        "isMounted:",
        isMounted.current,
      );
      return;
    }

    triggerHitEffect("player");

    setTimeout(() => {
      if (!isMounted.current) {
        console.log(
          "[useBattleController] performEnemyTurn 200ms timer fired but component is unmounted.",
        );
        return;
      }

      try {
        const isUltimateReady = enemyUltimateGauge >= 100;
        let moveName = "";
        let result;
        let logHeader = "";

        if (!isUltimateReady) {
          moveName = "Basic Attack";
          setEnemyUltimateGauge((prev) =>
            Math.min(100, prev + GAUGE_CHARGE_PER_HIT),
          );
          result = calculateDamage(currentEnemy, currentPlayer, 20, "basic");

          const cleanDesc = [];
          if (result.isCritical) cleanDesc.push("Critical hit!");
          result.desc = cleanDesc;

          logHeader = `${currentEnemy.name} used Basic Attack!`;
        } else {
          const randomMove =
            currentEnemy.moves[
              Math.floor(Math.random() * currentEnemy.moves.length)
            ];
          moveName = randomMove?.name || "Tackle";
          let movePower = randomMove?.power || 40;
          const moveType = randomMove?.type || "normal";

          // battle_state.level exists for wild Pokemon; gym Pokemon have level directly
          const enemyLevel =
            currentEnemy.battle_state?.level ?? currentEnemy.level ?? 5;
          if (enemyLevel < 5 && movePower > 50) {
            movePower = 50;
          }

          result = calculateDamage(
            currentEnemy,
            currentPlayer,
            movePower,
            moveType,
          );
          setEnemyUltimateGauge(0);
          logHeader = `>>> ENEMY ULTIMATE: ${moveName.toUpperCase()}! <<<`;
        }

        showDamage(
          "player",
          result.damage,
          result.isCritical,
          result.effectiveness,
        );

        console.log(
          "[useBattleController] performEnemyTurn calculating HP. playerCurrentHP:",
          playerCurrentHP,
          "damage:",
          result.damage,
        );
        const newHP = Math.max(0, playerCurrentHP - result.damage);
        setPlayerCurrentHP(newHP);

        const updatedHps = [...playerTeamHps];
        updatedHps[activePlayerIdx] = newHP;
        setPlayerTeamHps(updatedHps);

        console.log(
          "[useBattleController] performEnemyTurn HP updated. playerTeamHps:",
          updatedHps,
          "activePlayerIdx:",
          activePlayerIdx,
          "newHP:",
          newHP,
        );

        const logMessages = [
          logHeader,
          ...result.desc,
          ...(result.isMiss
            ? []
            : [`Dealt ${result.damage} damage to ${currentPlayer.nickname}.`]),
        ];

        if (!isUltimateReady) {
          logMessages.push("Enemy is charging power...");
        }

        setBattleLog((prev) => [...prev, ...logMessages]);

        if (newHP <= 0) {
          // Player's active Pokemon fainted. Check if we have another conscious Pokemon
          // Search ALL team members (not just those after current index) so any surviving
          // Pokemon earlier in the slot order can step in too.
          const nextConsciousIdx = updatedHps.findIndex(
            (hp, idx) => idx !== activePlayerIdx && hp > 0,
          );
          console.log(
            "[useBattleController] Player fainted. nextConsciousIdx:",
            nextConsciousIdx,
          );
          if (nextConsciousIdx !== -1) {
            const nextPoke = playerTeam[nextConsciousIdx];
            // Capture a snapshot of currentPlayer before state update changes it
            const faintedName =
              playerTeam[activePlayerIdx]?.nickname ?? "Pokémon";
            setBattleLog((prev) => [
              ...prev,
              `${faintedName} fainted!`,
              `Go, ${nextPoke.nickname}!`,
            ]);
            setActivePlayerIdx(nextConsciousIdx);
            setPlayerCurrentHP(updatedHps[nextConsciousIdx]);
            setUltimateGauge(0);
            setIsPlayerTurn(true);
            setIsProcessingTurn(false);
          } else {
            // Pass a snapshot so handleLose doesn't rely on stale closure
            const faintedPlayer = playerTeam[activePlayerIdx] || currentPlayer;
            handleLoseRef.current?.(faintedPlayer);
          }
        } else {
          console.log(
            "[useBattleController] Player survived, setting player turn back to true.",
          );
          setIsPlayerTurn(true);
          setIsProcessingTurn(false);
        }
      } catch (err) {
        // Safety net: if anything crashes inside the enemy turn, reset the turn
        // state so the game never permanently freezes.
        console.error(
          "[performEnemyTurn] Unexpected error during enemy turn:",
          err,
        );
        if (isMounted.current) {
          setIsPlayerTurn(true);
          setIsProcessingTurn(false);
          setBattleLog((prev) => [...prev, "Enemy fumbled the attack!"]);
        }
      }
    }, 200);
  }, [
    currentEnemy,
    currentPlayer,
    playerCurrentHP,
    gameOver,
    enemyUltimateGauge,
    playerTeamHps,
    activePlayerIdx,
    playerTeam,
    leaderId,
    leader,
  ]);

  // Keep performEnemyTurnRef pointing at the latest version every render
  performEnemyTurnRef.current = performEnemyTurn;

  // --- PLAYER ACTIONS ---
  const executePlayerAttack = (
    moveName: string,
    damagePayload: {
      damage: number;
      desc: Array<string>;
      isMiss: boolean;
      isCritical: boolean;
      effectiveness: number;
    },
    gaugeGain: number,
    isUltimate: boolean,
  ) => {
    if (
      !isPlayerTurn ||
      gameOver ||
      !currentPlayer ||
      !currentEnemy ||
      isProcessingTurn
    )
      return;

    setIsProcessingTurn(true);
    triggerHitEffect("enemy");

    setTimeout(() => {
      if (!isMounted.current) return;

      const { damage, desc, isMiss, isCritical, effectiveness } = damagePayload;

      showDamage("enemy", damage, isCritical, effectiveness);

      const newHP = Math.max(0, enemyCurrentHP - damage);
      setEnemyCurrentHP(newHP);

      if (!leaderId) {
        updateEnemyState({ current_hp: newHP });
      }

      if (isUltimate) {
        setUltimateGauge(0);
      } else {
        setUltimateGauge((prev) => Math.min(100, prev + gaugeGain));
      }

      let headerLog = "";
      if (isUltimate) {
        headerLog = `>>> ULTIMATE SKILL: ${moveName.toUpperCase()}! <<<`;
      } else {
        headerLog = `${currentPlayer.nickname} used ${moveName}!`;
      }

      const logMessages = [
        headerLog,
        ...desc,
        ...(isMiss ? [] : [`Dealt ${damage} damage.`]),
      ];

      if (!isUltimate && !isMiss) {
        logMessages.push(`Gauge +${gaugeGain}%`);
      }

      setBattleLog((prev) => [...prev, ...logMessages]);

      if (newHP <= 0) {
        handleWin();
      } else {
        console.log(
          "[useBattleController] executePlayerAttack: Enemy survived, ending player turn and scheduling performEnemyTurn in 1500ms.",
        );
        setIsPlayerTurn(false);
        setTimeout(() => {
          if (isMounted.current) {
            console.log(
              "[useBattleController] 1500ms timer fired. Calling performEnemyTurnRef.current. Exists:",
              !!performEnemyTurnRef.current,
            );
            performEnemyTurnRef.current?.();
          } else {
            console.log(
              "[useBattleController] 1500ms timer fired but component is unmounted.",
            );
          }
        }, 1500);
      }
    }, 200);
  };

  const basicAttack = () => {
    if (isProcessingTurn || !currentPlayer || !currentEnemy) return;
    const basicAttackPower = 20;

    const result = calculateDamage(
      currentPlayer,
      currentEnemy,
      basicAttackPower,
      "basic",
    );

    const cleanDesc = [];
    if (result.isCritical) cleanDesc.push("Critical hit!");

    const finalResult = { ...result, desc: cleanDesc, effectiveness: 1 };

    executePlayerAttack(
      "Basic Attack",
      finalResult,
      GAUGE_CHARGE_PER_HIT,
      false,
    );
  };

  const useUltimate = (
    moveName: string,
    movePower: number,
    moveType: string,
  ) => {
    if (
      ultimateGauge < 100 ||
      isProcessingTurn ||
      !currentPlayer ||
      !currentEnemy
    )
      return;

    const result = calculateDamage(
      currentPlayer,
      currentEnemy,
      movePower,
      moveType,
    );
    executePlayerAttack(moveName, result, 0, true);
  };

  const useStruggle = () => {
    if (isProcessingTurn || !currentPlayer || !currentEnemy) return;
    const result = calculateDamage(currentPlayer, currentEnemy, 20, "normal");
    executePlayerAttack("Struggle", result, 0, false);
  };

  const actions = {
    basicAttack,
    useUltimate,
    useStruggle,
    runAway: () => {
      clearStorage();
      navigate("/profile");
    },
    findNew: () => {
      clearStorage();
      window.location.reload();
    },
    surrender: () => {
      clearStorage();
      navigate("/profile");
    },
    setShowIntro,
  };

  return {
    state: {
      playerCurrentHP,
      enemyCurrentHP,
      ultimateGauge,
      isPlayerTurn,
      isProcessingTurn,
      gameOver,
      battleLog,
      showIntro,
      activeHitTarget,
      hitKey,
      damages,
      currentPlayer,
      currentEnemy,
      playerTeam,
      activePlayerIdx,
      playerTeamHps,
    },
    actions,
  };
};
