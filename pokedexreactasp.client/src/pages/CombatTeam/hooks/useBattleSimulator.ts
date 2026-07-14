import { useState } from "react";
import toast from "react-hot-toast";
import { ICombatPokemon } from "@/types/pokemon";

export type LogEntry = {
  text: string;
  type?: "attack" | "info" | "critical" | "heal";
  attacker?: "player" | "computer";
  activePlayer?: ICombatPokemon;
  activeComputer?: ICombatPokemon;
  playerHp?: number;
  computerHp?: number;
  playerMaxHp?: number;
  computerMaxHp?: number;
};

// Computer team preset — fallback when storage < 6
const CPU_PRESET: ICombatPokemon[] = [
  {
    id: 6,
    name: "CHARIZARD",
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png",
    types: ["fire", "flying"],
    stats: [
      { base_stat: 78, effort: 0, stat: { name: "hp", url: "" } },
      { base_stat: 84, effort: 0, stat: { name: "attack", url: "" } },
      { base_stat: 78, effort: 0, stat: { name: "defense", url: "" } },
      { base_stat: 109, effort: 2, stat: { name: "special-attack", url: "" } },
      { base_stat: 85, effort: 0, stat: { name: "special-defense", url: "" } },
      { base_stat: 100, effort: 0, stat: { name: "speed", url: "" } },
    ],
    abilities: ["blaze", "solar-power"],
    moves: ["flamethrower", "dragon-claw", "air-slash", "earthquake"],
    level: 50,
    experience: 240,
  },
  {
    id: 9,
    name: "BLASTOISE",
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png",
    types: ["water"],
    stats: [
      { base_stat: 79, effort: 0, stat: { name: "hp", url: "" } },
      { base_stat: 83, effort: 0, stat: { name: "attack", url: "" } },
      { base_stat: 100, effort: 0, stat: { name: "defense", url: "" } },
      { base_stat: 85, effort: 0, stat: { name: "special-attack", url: "" } },
      { base_stat: 105, effort: 3, stat: { name: "special-defense", url: "" } },
      { base_stat: 78, effort: 0, stat: { name: "speed", url: "" } },
    ],
    abilities: ["torrent", "rain-dish"],
    moves: ["hydro-pump", "ice-beam", "flash-cannon", "dark-pulse"],
    level: 50,
    experience: 239,
  },
  {
    id: 3,
    name: "VENUSAUR",
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png",
    types: ["grass", "poison"],
    stats: [
      { base_stat: 80, effort: 0, stat: { name: "hp", url: "" } },
      { base_stat: 82, effort: 0, stat: { name: "attack", url: "" } },
      { base_stat: 83, effort: 0, stat: { name: "defense", url: "" } },
      { base_stat: 100, effort: 2, stat: { name: "special-attack", url: "" } },
      { base_stat: 100, effort: 0, stat: { name: "special-defense", url: "" } },
      { base_stat: 80, effort: 0, stat: { name: "speed", url: "" } },
    ],
    abilities: ["overgrow", "chlorophyll"],
    moves: ["solar-beam", "sludge-bomb", "earthquake", "synthesis"],
    level: 50,
    experience: 236,
  },
];

function getStatValue(pokemon: ICombatPokemon, statName: string): number {
  const stat = pokemon.stats.find(
    (s) =>
      s.stat.name === statName || s.stat.name.replace("-", "") === statName,
  );
  return stat ? stat.base_stat : 0;
}

export function useBattleSimulator(storageTeam: ICombatPokemon[]) {
  const [simulationLog, setSimulationLog] = useState<LogEntry[]>([]);
  const [isBattling, setIsBattling] = useState(false);
  const [computerTeam, setComputerTeam] = useState<ICombatPokemon[]>([]);

  const generateComputerTeam = (storage: ICombatPokemon[]) => {
    if (storage.length >= 6) {
      const shuffled = [...storage].sort(() => 0.5 - Math.random());
      setComputerTeam(shuffled.slice(0, 6));
    } else {
      setComputerTeam(CPU_PRESET);
    }
  };

  const simulateBattle = (
    userTeam: ICombatPokemon[],
    cpuTeam: ICombatPokemon[],
  ): { fullLog: LogEntry[]; userWon: boolean } => {
    const userCopy = [...userTeam];
    const cpuCopy = [...cpuTeam];
    const log: LogEntry[] = [];
    let userTurn = true;

    let userActiveHp =
      userCopy.length > 0 ? getStatValue(userCopy[0], "hp") : 0;
    let cpuActiveHp = cpuCopy.length > 0 ? getStatValue(cpuCopy[0], "hp") : 0;

    const pushLog = (
      text: string,
      type?: LogEntry["type"],
      attacker?: "player" | "computer",
    ) => {
      log.push({
        text,
        type,
        attacker,
        activePlayer: userCopy.length > 0 ? userCopy[0] : undefined,
        activeComputer: cpuCopy.length > 0 ? cpuCopy[0] : undefined,
        playerHp: Math.max(0, userActiveHp),
        computerHp: Math.max(0, cpuActiveHp),
        playerMaxHp: userCopy.length > 0 ? getStatValue(userCopy[0], "hp") : 0,
        computerMaxHp: cpuCopy.length > 0 ? getStatValue(cpuCopy[0], "hp") : 0,
      });
    };

    pushLog("Battle started!", "info");

    while (userCopy.length > 0 && cpuCopy.length > 0) {
      const attackingTeam = userTurn ? userCopy : cpuCopy;
      const defendingTeam = userTurn ? cpuCopy : userCopy;
      const attacker = attackingTeam[0];
      const defender = defendingTeam[0];

      const atkStat = getStatValue(attacker, "attack");
      const defStat = getStatValue(defender, "defense");
      const spdStat = getStatValue(attacker, "speed");

      const isCritical = Math.random() < spdStat / 512;
      let damage =
        ((attacker.level * 0.4 + 2) * atkStat) / Math.max(defStat, 1);
      damage = damage / 50 + 2;
      if (isCritical) damage *= 1.5;
      damage *= 0.85 + Math.random() * 0.15;
      damage = Math.max(1, Math.floor(damage));

      const attackerOwner = userTurn ? "Your" : "Computer's";
      const defenderOwner = userTurn ? "Computer's" : "Your";
      const attackerType = userTurn ? "player" : "computer";

      if (userTurn) {
        cpuActiveHp -= damage;
        pushLog(
          `${attackerOwner} ${attacker.name} attacks ${defenderOwner} ${defender.name} for ${damage} damage${isCritical ? " (CRITICAL HIT!)" : ""}`,
          isCritical ? "critical" : "attack",
          attackerType,
        );
        if (cpuActiveHp <= 0) {
          pushLog(`Computer's ${defender.name} fainted!`, "info");
          cpuCopy.shift();
          if (cpuCopy.length > 0) {
            cpuActiveHp = getStatValue(cpuCopy[0], "hp");
            pushLog(`Computer sent out ${cpuCopy[0].name}!`, "info");
          }
        }
      } else {
        userActiveHp -= damage;
        pushLog(
          `${attackerOwner} ${attacker.name} attacks ${defenderOwner} ${defender.name} for ${damage} damage${isCritical ? " (CRITICAL HIT!)" : ""}`,
          isCritical ? "critical" : "attack",
          attackerType,
        );
        if (userActiveHp <= 0) {
          pushLog(`Your ${defender.name} fainted!`, "info");
          userCopy.shift();
          if (userCopy.length > 0) {
            userActiveHp = getStatValue(userCopy[0], "hp");
            pushLog(`You sent out ${userCopy[0].name}!`, "info");
          }
        }
      }

      userTurn = !userTurn;
    }

    const userWon = userCopy.length > 0;
    pushLog("Battle finished!", "info");
    pushLog(
      userWon ? "You won the battle!" : "Computer won the battle!",
      userWon ? "heal" : "attack",
    );

    return { fullLog: log, userWon };
  };

  const runBattle = (activeTeam: ICombatPokemon[]) => {
    if (activeTeam.length === 0) {
      toast.error("You need Pokémon in your active team to battle!");
      return;
    }

    let cpuTeam = computerTeam;
    if (cpuTeam.length === 0) {
      const newCpu =
        storageTeam.length >= 6
          ? [...storageTeam].sort(() => 0.5 - Math.random()).slice(0, 6)
          : CPU_PRESET;
      setComputerTeam(newCpu);
      cpuTeam = newCpu;
    }

    setIsBattling(true);
    setSimulationLog([]); // Clear log before starting
    const { fullLog, userWon } = simulateBattle(activeTeam, cpuTeam);

    let currentIndex = 0;
    const intervalId = setInterval(() => {
      currentIndex++;
      setSimulationLog(fullLog.slice(0, currentIndex));

      if (currentIndex >= fullLog.length) {
        clearInterval(intervalId);
        setIsBattling(false);
        toast(
          userWon
            ? "Victory! Your team won the battle!"
            : "Defeat! Better luck next time!",
        );
      }
    }, 1000);
  };

  const resetBattle = () => {
    setSimulationLog([]);
    generateComputerTeam(storageTeam);
  };

  return {
    simulationLog,
    isBattling,
    computerTeam,
    generateComputerTeam,
    runBattle,
    resetBattle,
  };
}
