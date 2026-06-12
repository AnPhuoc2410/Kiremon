import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBattleMechanics } from "./useBattleMechanics";
import { usePokemonExperience } from "./usePokemonExperience";
import { useDamageSystem } from "./useDamageSystem";
import { userService } from "@/services/user/user.service";
import { collectionService } from "@/services/collection/collection.service";
import toast from "react-hot-toast";
import { battleService } from "@/services/battle/battle.service";

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

const HIT_EFFECT_DURATION = 600;
const GAUGE_CHARGE_PER_HIT = 20;

const powerFromMoveName = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return 30 + (hash % 36);
};

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

  const generateMovesForPokemon = (
    name: string,
    type1: string,
    type2: string | null,
  ) => {
    const t1 = type1.toLowerCase();
    const t2 = type2?.toLowerCase();

    const movePool: Record<
      string,
      Array<{ name: string; power: number; type: string }>
    > = {
      fire: [
        { name: "Ember", power: 40, type: "fire" },
        { name: "Flame Wheel", power: 60, type: "fire" },
        { name: "Flamethrower", power: 90, type: "fire" },
        { name: "Fire Blast", power: 110, type: "fire" },
      ],
      water: [
        { name: "Water Gun", power: 40, type: "water" },
        { name: "Water Pulse", power: 60, type: "water" },
        { name: "Surf", power: 90, type: "water" },
        { name: "Hydro Pump", power: 110, type: "water" },
      ],
      grass: [
        { name: "Vine Whip", power: 40, type: "grass" },
        { name: "Razor Leaf", power: 55, type: "grass" },
        { name: "Giga Drain", power: 75, type: "grass" },
        { name: "Solar Beam", power: 120, type: "grass" },
      ],
      electric: [
        { name: "Thunder Shock", power: 40, type: "electric" },
        { name: "Spark", power: 65, type: "electric" },
        { name: "Thunderbolt", power: 90, type: "electric" },
        { name: "Thunder", power: 110, type: "electric" },
      ],
      ice: [
        { name: "Powder Snow", power: 40, type: "ice" },
        { name: "Aurora Beam", power: 65, type: "ice" },
        { name: "Ice Beam", power: 90, type: "ice" },
        { name: "Blizzard", power: 110, type: "ice" },
      ],
      fighting: [
        { name: "Mach Punch", power: 40, type: "fighting" },
        { name: "Karate Chop", power: 50, type: "fighting" },
        { name: "Brick Break", power: 75, type: "fighting" },
        { name: "Close Combat", power: 120, type: "fighting" },
      ],
      poison: [
        { name: "Poison Sting", power: 30, type: "poison" },
        { name: "Acid", power: 40, type: "poison" },
        { name: "Sludge Bomb", power: 90, type: "poison" },
        { name: "Gunk Shot", power: 120, type: "poison" },
      ],
      ground: [
        { name: "Mud-Slap", power: 20, type: "ground" },
        { name: "Mud Shot", power: 55, type: "ground" },
        { name: "Dig", power: 80, type: "ground" },
        { name: "Earthquake", power: 100, type: "ground" },
      ],
      flying: [
        { name: "Gust", power: 40, type: "flying" },
        { name: "Wing Attack", power: 60, type: "flying" },
        { name: "Air Slash", power: 75, type: "flying" },
        { name: "Hurricane", power: 110, type: "flying" },
      ],
      psychic: [
        { name: "Confusion", power: 50, type: "psychic" },
        { name: "Psybeam", power: 65, type: "psychic" },
        { name: "Psychic", power: 90, type: "psychic" },
        { name: "Psystrike", power: 100, type: "psychic" },
      ],
      bug: [
        { name: "Struggle Bug", power: 50, type: "bug" },
        { name: "Bug Bite", power: 60, type: "bug" },
        { name: "Lunge", power: 80, type: "bug" },
        { name: "Megahorn", power: 120, type: "bug" },
      ],
      rock: [
        { name: "Rock Throw", power: 50, type: "rock" },
        { name: "Rock Tomb", power: 60, type: "rock" },
        { name: "Rock Slide", power: 75, type: "rock" },
        { name: "Stone Edge", power: 100, type: "rock" },
      ],
      ghost: [
        { name: "Lick", power: 30, type: "ghost" },
        { name: "Shadow Sneak", power: 40, type: "ghost" },
        { name: "Shadow Punch", power: 60, type: "ghost" },
        { name: "Shadow Ball", power: 80, type: "ghost" },
      ],
      dragon: [
        { name: "Dragon Breath", power: 60, type: "dragon" },
        { name: "Dragon Claw", power: 80, type: "dragon" },
        { name: "Dragon Pulse", power: 85, type: "dragon" },
        { name: "Outrage", power: 120, type: "dragon" },
      ],
      dark: [
        { name: "Bite", power: 60, type: "dark" },
        { name: "Foul Play", power: 95, type: "dark" },
        { name: "Dark Pulse", power: 80, type: "dark" },
        { name: "Night Slash", power: 70, type: "dark" },
      ],
      steel: [
        { name: "Metal Claw", power: 50, type: "steel" },
        { name: "Iron Head", power: 80, type: "steel" },
        { name: "Flash Cannon", power: 80, type: "steel" },
        { name: "Meteor Mash", power: 90, type: "steel" },
      ],
      fairy: [
        { name: "Fairy Wind", power: 40, type: "fairy" },
        { name: "Draining Kiss", power: 50, type: "fairy" },
        { name: "Dazzling Gleam", power: 80, type: "fairy" },
        { name: "Moonblast", power: 95, type: "fairy" },
      ],
      normal: [
        { name: "Tackle", power: 40, type: "normal" },
        { name: "Scratch", power: 40, type: "normal" },
        { name: "Slash", power: 70, type: "normal" },
        { name: "Hyper Beam", power: 150, type: "normal" },
      ],
    };

    const defaultNormal = [
      { name: "Tackle", power: 40, type: "normal" },
      { name: "Scratch", power: 40, type: "normal" },
      { name: "Slash", power: 70, type: "normal" },
      { name: "Hyper Beam", power: 150, type: "normal" },
    ];

    const moves1 = movePool[t1] || defaultNormal;
    const moves2 = t2 ? movePool[t2] || defaultNormal : [];

    return [
      { name: "Tackle", power: 40, type: "normal" },
      moves1[1] || moves1[0],
      t2 && moves2[2] ? moves2[2] : moves1[2] || moves1[0],
      moves1[3] || moves1[0],
    ];
  };

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

          return {
            id: p.id,
            name: p.displayName || p.name,
            nickname: p.nickname || p.displayName || p.name,
            sprite: p.spriteUrl,
            sprite_back: p.spriteUrl,
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
        if (savedState) {
          setActivePlayerIdx(savedState.activePlayerIdx);
          setPlayerTeamHps(savedState.playerTeamHps);
          setPlayerCurrentHP(savedState.playerCurrentHP);
          setEnemyCurrentHP(savedState.enemyCurrentHP);
          setIsPlayerTurn(savedState.isPlayerTurn);
          setBattleLog(savedState.battleLog);
          setUltimateGauge(savedState.ultimateGauge);
          setEnemyUltimateGauge(savedState.enemyUltimateGauge);
          setShowIntro(savedState.showIntro);
          setGameOver(savedState.gameOver);

          if (
            leaderId &&
            savedState.activeEnemyIndex !== undefined &&
            updateRosterPokemon
          ) {
            const gymRosterHps = savedState.gymRosterHps || [];
            gymRosterHps.forEach((hp, idx) => {
              updateRosterPokemon(idx, {
                current_hp: hp,
                is_defeated: hp <= 0,
              });
            });
          }
        } else {
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

  const clearStorage = async () => {
    const keyName = leaderId ? "gym_" + leaderId : "wild";
    try {
      await battleService.clearBattleState(keyName);
    } catch (err) {
      console.error("Failed to clear battle state from Redis:", err);
    }
    if (clearGymBattle) clearGymBattle();
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
      clearStorage();
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

  const handleLose = () => {
    if (!currentEnemy || !currentPlayer) return;

    if (leaderId) {
      const loseLogs = [
        "Your team fainted...",
        `Gym Leader ${leader.name} won the battle!`,
      ];
      safeSetState(setBattleLog, (prev: Array<string>) => [
        ...prev,
        ...loseLogs,
      ]);
      safeSetState(setGameOver, true);
      setIsProcessingTurn(false);
      clearStorage();
    } else {
      const baseExp = currentEnemy.base_experience || 60;
      const partialExp = Math.floor(
        calculateExpGain(currentEnemy.battle_state.level, baseExp) / 4,
      );
      const result = addExp(currentPlayer.nickname, partialExp);

      const loseLogs = [
        `${currentPlayer.nickname} Fainted...`,
        `Gained ${partialExp} EXP.`,
      ];
      if (result.leveled) {
        loseLogs.push(
          `${currentPlayer.nickname} grew to Level ${result.newLevel}!`,
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
    }
  };

  // --- ENEMY TURN ---
  const performEnemyTurn = useCallback(() => {
    if (gameOver || !currentEnemy || !currentPlayer || !isMounted.current)
      return;

    triggerHitEffect("player");

    setTimeout(() => {
      if (!isMounted.current) return;

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

        if (currentEnemy.battle_state.level < 5 && movePower > 50) {
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

      const newHP = Math.max(0, playerCurrentHP - result.damage);
      setPlayerCurrentHP(newHP);

      const updatedHps = [...playerTeamHps];
      updatedHps[activePlayerIdx] = newHP;
      setPlayerTeamHps(updatedHps);

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
        const nextConsciousIdx = updatedHps.findIndex(
          (hp, idx) => idx > activePlayerIdx && hp > 0,
        );
        if (nextConsciousIdx !== -1) {
          const nextPoke = playerTeam[nextConsciousIdx];
          setBattleLog((prev) => [
            ...prev,
            `${currentPlayer.nickname} fainted!`,
            `Go, ${nextPoke.nickname}!`,
          ]);
          setActivePlayerIdx(nextConsciousIdx);
          setPlayerCurrentHP(updatedHps[nextConsciousIdx]);
          setUltimateGauge(0);
          setIsPlayerTurn(true);
          setIsProcessingTurn(false);
        } else {
          handleLose();
        }
      } else {
        setIsPlayerTurn(true);
        setIsProcessingTurn(false);
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
  ]);

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
        setIsPlayerTurn(false);
        setTimeout(() => {
          if (isMounted.current) performEnemyTurn();
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
