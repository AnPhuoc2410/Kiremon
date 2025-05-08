import React, { useState, useEffect, createRef } from "react";
import { useNavigate } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import toast from "react-hot-toast";

import {
  Button,
  Navbar,
  Text,
  Header,
  Loading,
  Modal,
  TypeIcon
} from "../../components/ui";
import { ICombatPokemon, ICombatTeam, IMyPokemon } from "../../types/pokemon";
import { getDetailPokemon } from "../../services/pokemon";
import * as S from "./index.style";

// Maximum team size for active team
const MAX_TEAM_SIZE = 6;

const CombatTeam: React.FC = () => {
  const navigate = useNavigate();
  const navRef = createRef<HTMLDivElement>();
  const [navHeight, setNavHeight] = useState<number>(0);

  // State management
  const [activeTab, setActiveTab] = useState<string>("teams");
  const [teamData, setTeamData] = useState<ICombatTeam>({
    active: [],
    dream: [],
    storage: []
  });
  const [selectedPokemon, setSelectedPokemon] = useState<ICombatPokemon | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showMoveModal, setShowMoveModal] = useState<boolean>(false);
  const [targetTeam, setTargetTeam] = useState<"active" | "dream" | "storage">("active");
  const [simulationLog, setSimulationLog] = useState<Array<{text: string, type?: 'attack' | 'info' | 'critical' | 'heal'}>>([]);
  const [isBattling, setIsBattling] = useState<boolean>(false);
  const [computerTeam, setComputerTeam] = useState<ICombatPokemon[]>([]);
  const [myCaughtPokemon, setMyCaughtPokemon] = useState<{name: string, nickname: string, sprite: string}[]>([]);
  const [availablePokemon, setAvailablePokemon] = useState<ICombatPokemon[]>([]);
  const [isLoadingPokemonDetails, setIsLoadingPokemonDetails] = useState<boolean>(false);
  const [showAddPokemonModal, setShowAddPokemonModal] = useState<boolean>(false);

  // Load team data from localStorage
  useEffect(() => {
    console.log("CombatTeam: useEffect triggered for initial data load");

    // Set navbar height only once
    if (navRef.current) {
      setNavHeight(navRef.current.clientHeight);
    }

    const loadData = async () => {
      try {
        setIsLoading(true);
        console.log("CombatTeam: Starting data load...");

        // Load team data
        const storedTeamData = localStorage.getItem("pokegames@combatTeam");
        console.log("CombatTeam: Retrieved team data from localStorage", storedTeamData ? "found" : "not found");

        let parsedTeamData: ICombatTeam = {
          active: [],
          dream: [],
          storage: []
        };

        if (storedTeamData) {
          try {
            const parsed = JSON.parse(storedTeamData);
            parsedTeamData = {
              active: Array.isArray(parsed.active) ? parsed.active : [],
              dream: Array.isArray(parsed.dream) ? parsed.dream : [],
              storage: Array.isArray(parsed.storage) ? parsed.storage : []
            };
            console.log("CombatTeam: Successfully parsed team data");
          } catch (parseError) {
            console.error("CombatTeam: Error parsing team data from localStorage:", parseError);
            // Continue with empty teams if parsing fails
          }
        }

        // Extract all Pokemon names that are already in teams
        const allTeamPokemonNames = [
          ...(parsedTeamData.active || []).map((p: ICombatPokemon) => p.name),
          ...(parsedTeamData.dream || []).map((p: ICombatPokemon) => p.name),
          ...(parsedTeamData.storage || []).map((p: ICombatPokemon) => p.name)
        ];
        console.log("CombatTeam: Found existing Pokemon in teams:", allTeamPokemonNames);

        // Load caught Pokemon
        const caughtPokemonData = localStorage.getItem("pokegames@myPokemon");
        if (caughtPokemonData) {
          try {
            console.log("CombatTeam: Retrieved caught Pokemon data from localStorage");
            const parsedCaughtPokemon = JSON.parse(caughtPokemonData) || [];
            setMyCaughtPokemon(parsedCaughtPokemon);
            console.log("CombatTeam: Found", parsedCaughtPokemon.length, "caught Pokemon");

            if (parsedCaughtPokemon.length > 0) {
              // Load detailed data for caught Pokemon
              console.log("CombatTeam: Loading details for caught Pokemon...");
              try {
                const detailedPokemon = await loadCaughtPokemonDetailsForStorage(
                  parsedCaughtPokemon,
                  allTeamPokemonNames
                );
                console.log("CombatTeam: Successfully loaded details for", detailedPokemon.length, "Pokemon");

                // Add new Pokemon to storage if they're not in any team yet
                if (detailedPokemon.length > 0) {
                  parsedTeamData.storage = [...parsedTeamData.storage, ...detailedPokemon];
                  console.log("CombatTeam: Added", detailedPokemon.length, "new Pokemon to storage");
                }
              } catch (detailsError) {
                console.error("CombatTeam: Error loading Pokemon details:", detailsError);
                // Continue with the current team data if loading details fails
              }
            }
          } catch (parseError) {
            console.error("CombatTeam: Error parsing caught Pokemon data:", parseError);
            // Continue with the current team data if parsing fails
          }
        } else {
          console.log("CombatTeam: No caught Pokemon data found");
        }

        // Finally set the team data with any newly added Pokemon
        console.log("CombatTeam: Setting final team data");
        setTeamData(parsedTeamData);
      } catch (error) {
        console.error("CombatTeam: Critical error loading data:", error);
        toast.error("Failed to load your teams. Please try again.");
      } finally {
        console.log("CombatTeam: Finished loading data, setting isLoading to false");
        setIsLoading(false);
      }
    };

    loadData();

    // Empty dependency array means this effect runs only once on mount
  }, []);

  // Load detailed Pokemon data for caught Pokemon
  const loadCaughtPokemonDetails = async (caughtPokemon: {name: string, nickname: string, sprite: string}[]) => {
    try {
      setIsLoadingPokemonDetails(true);

      // Get all Pokemon that are caught but not in a team yet
      const existingTeamPokemonNames = getAllTeamPokemonNames();
      const uniqueCaughtPokemon = caughtPokemon.filter(
        p => !existingTeamPokemonNames.includes(p.nickname)
      );

      if (uniqueCaughtPokemon.length === 0) {
        setAvailablePokemon([]);
        setIsLoadingPokemonDetails(false);
        return;
      }

      // Load detailed data for each Pokemon
      const detailedPokemonPromises = uniqueCaughtPokemon.map(async (pokemon) => {
        try {
          // Get detailed Pokemon data from API
          const detailResponse = await getDetailPokemon(pokemon.name.toLowerCase());

          if (!detailResponse) {
            // Skip if we couldn't get details
            return null;
          }

          // Create a combat Pokemon object
          return {
            id: detailResponse.id,
            name: pokemon.nickname, // Use nickname for combat
            originalName: pokemon.name.toUpperCase(), // Store original name
            sprite: pokemon.sprite,
            types: detailResponse.types.map((type: any) => type.type.name),
            stats: detailResponse.stats,
            abilities: detailResponse.abilities.map((a: any) => a.ability.name),
            moves: detailResponse.moves
              .slice(0, Math.min(4, detailResponse.moves.length))
              .map((m: any) => m.move.name),
            level: 50, // Default level for battle
            experience: detailResponse.base_experience || 100,
          } as ICombatPokemon;
        } catch (error) {
          console.error(`Error loading details for ${pokemon.name}:`, error);
          return null;
        }
      });

      // Wait for all Pokemon details to load
      const detailedPokemon = await Promise.all(detailedPokemonPromises);

      // Filter out null values and explicitly type as ICombatPokemon[]
      const validPokemon: ICombatPokemon[] = detailedPokemon.filter((p): p is ICombatPokemon => p !== null);
      setAvailablePokemon(validPokemon);

    } catch (error) {
      console.error("Error loading Pokemon details:", error);
      toast.error("Failed to load Pokemon details.");
    } finally {
      setIsLoadingPokemonDetails(false);
    }
  };

  // Load detailed Pokemon data for caught Pokemon to add to storage
  const loadCaughtPokemonDetailsForStorage = async (
    caughtPokemon: {name: string, nickname: string, sprite: string}[],
    existingTeamPokemonNames: string[]
  ): Promise<ICombatPokemon[]> => {
    try {
      console.log("Starting to load details for", caughtPokemon.length, "caught Pokemon");

      // Get all Pokemon that are caught but not in a team yet
      const uniqueCaughtPokemon = caughtPokemon.filter(
        p => !existingTeamPokemonNames.includes(p.nickname)
      );

      console.log("Filtered to", uniqueCaughtPokemon.length, "unique Pokemon not in teams");

      if (uniqueCaughtPokemon.length === 0) {
        return [];
      }

      // To avoid overwhelming the API, process in batches
      const results: ICombatPokemon[] = [];
      const batchSize = 3; // Process 3 at a time to avoid rate limiting

      for (let i = 0; i < uniqueCaughtPokemon.length; i += batchSize) {
        const batch = uniqueCaughtPokemon.slice(i, i + batchSize);
        console.log(`Processing batch ${i/batchSize + 1} of ${Math.ceil(uniqueCaughtPokemon.length/batchSize)}`);

        // Process each Pokemon in the batch
        const batchPromises = batch.map(async (pokemon) => {
          try {
            // Use the sprite URL if we already have it rather than hitting the API
            if (pokemon.sprite) {
              // Extract the Pokemon ID from the sprite URL if possible
              const idMatch = pokemon.sprite.match(/\/(\d+)\.png$/);
              const id = idMatch ? parseInt(idMatch[1]) : 0;

              // Create a minimal combat Pokemon object with the data we have
              return {
                id: id,
                name: pokemon.nickname,
                originalName: pokemon.name.toUpperCase(),
                sprite: pokemon.sprite,
                types: [], // Will be populated from API if available
                stats: [{ base_stat: 50, effort: 0, stat: { name: "hp", url: "" } }], // Default stats
                abilities: [],
                moves: [],
                level: 50,
                experience: 100
              } as ICombatPokemon;
            }

            // Get detailed Pokemon data from API only if needed
            console.log(`Fetching details for ${pokemon.name}`);
            const detailResponse = await getDetailPokemon(pokemon.name.toLowerCase());

            if (!detailResponse) {
              console.log(`No data returned for ${pokemon.name}`);
              return null;
            }

            // Create a combat Pokemon object
            return {
              id: detailResponse.id,
              name: pokemon.nickname,
              originalName: pokemon.name.toUpperCase(),
              sprite: pokemon.sprite || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${detailResponse.id}.png`,
              types: detailResponse.types.map((type: any) => type.type.name),
              stats: detailResponse.stats,
              abilities: detailResponse.abilities.map((a: any) => a.ability.name),
              moves: detailResponse.moves
                .slice(0, Math.min(4, detailResponse.moves.length))
                .map((m: any) => m.move.name),
              level: 50,
              experience: detailResponse.base_experience || 100,
            } as ICombatPokemon;
          } catch (error) {
            console.error(`Error loading details for ${pokemon.name}:`, error);
            // Return a minimal Pokemon object so the app doesn't break
            return {
              id: Math.floor(Math.random() * 1000) + 1000, // Random ID to avoid collisions
              name: pokemon.nickname,
              originalName: pokemon.name.toUpperCase(),
              sprite: pokemon.sprite || 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png',
              types: [],
              stats: [{ base_stat: 50, effort: 0, stat: { name: "hp", url: "" } }],
              abilities: [],
              moves: [],
              level: 50,
              experience: 100
            } as ICombatPokemon;
          }
        });

        // Wait for the current batch to complete
        const batchResults = await Promise.all(batchPromises);

        // Add valid results to our collection
        results.push(...batchResults.filter((p): p is ICombatPokemon => p !== null));

        // Small delay between batches to avoid rate limiting
        if (i + batchSize < uniqueCaughtPokemon.length) {
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }

      console.log("Successfully loaded", results.length, "Pokemon details");
      return results;
    } catch (error) {
      console.error("Error loading Pokemon details for storage:", error);
      return []; // Return empty array instead of throwing
    }
  };

  // Get all Pokemon names from teams
  const getAllTeamPokemonNames = () => {
    // Collect all Pokemon names across all teams
    return [
      ...teamData.active.map(p => p.name),
      ...teamData.dream.map(p => p.name),
      ...teamData.storage.map(p => p.name)
    ];
  };

  // Save team data whenever it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("pokegames@combatTeam", JSON.stringify(teamData));
    }
  }, [teamData, isLoading]);

  // Handle moving a Pokemon between teams
  const handleMovePokemon = (pokemon: ICombatPokemon, targetTeam: "active" | "dream" | "storage") => {
    // Check if active team is full
    if (targetTeam === "active" && teamData.active.length >= MAX_TEAM_SIZE) {
      toast.error(`Your active team is full! Maximum size is ${MAX_TEAM_SIZE} Pokémon.`);
      return;
    }

    setTeamData(prevTeamData => {
      // First remove from current team
      const updatedTeams = {
        active: prevTeamData.active.filter(p => p.name !== pokemon.name),
        dream: prevTeamData.dream.filter(p => p.name !== pokemon.name),
        storage: prevTeamData.storage.filter(p => p.name !== pokemon.name)
      };

      // Then add to target team
      updatedTeams[targetTeam] = [...updatedTeams[targetTeam], pokemon];

      toast.success(`${pokemon.name} moved to ${targetTeam === "active" ? "active team" : targetTeam === "dream" ? "dream team" : "storage"}.`);
      return updatedTeams;
    });
  };

  // Handle adding a Pokemon to a team
  const handleAddPokemon = (pokemon: ICombatPokemon, targetTeam: "active" | "dream" | "storage") => {
    // Check if active team is full
    if (targetTeam === "active" && teamData.active.length >= MAX_TEAM_SIZE) {
      toast.error(`Your active team is full! Maximum size is ${MAX_TEAM_SIZE} Pokémon.`);
      return;
    }

    setTeamData(prevTeamData => {
      const updatedTeams = { ...prevTeamData };
      updatedTeams[targetTeam] = [...updatedTeams[targetTeam], pokemon];

      toast.success(`${pokemon.name} added to ${targetTeam === "active" ? "active team" : targetTeam === "dream" ? "dream team" : "storage"}.`);
      return updatedTeams;
    });

    setShowAddPokemonModal(false);
  };

  const handleRemovePokemon = (pokemon: ICombatPokemon) => {
    setTeamData(prevTeamData => {
      return {
        active: prevTeamData.active.filter(p => p.name !== pokemon.name),
        dream: prevTeamData.dream.filter(p => p.name !== pokemon.name),
        storage: prevTeamData.storage.filter(p => p.name !== pokemon.name)
      };
    });

    toast.success(`${pokemon.name} was removed from your teams.`);

    // Refresh available Pokemon list
    loadCaughtPokemonDetails(myCaughtPokemon);
  };

  const openMoveModal = (pokemon: ICombatPokemon, team: "active" | "dream" | "storage") => {
    setSelectedPokemon(pokemon);
    setTargetTeam(team);
    setShowMoveModal(true);
  };

  // Calculate total stats for a team
  const calculateTeamStats = (team: ICombatPokemon[]) => {
    if (!team.length) return { hp: 0, attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0, total: 0 };

    // Initial object with all stats at 0
    const totalStats = {
      hp: 0,
      attack: 0,
      defense: 0,
      specialAttack: 0,
      specialDefense: 0,
      speed: 0,
      total: 0
    };

    // Sum up all stats from team Pokémon
    team.forEach(pokemon => {
      pokemon.stats.forEach(stat => {
        const statName = stat.stat.name.replace('-', '');
        switch(statName) {
          case 'hp':
            totalStats.hp += stat.base_stat;
            break;
          case 'attack':
            totalStats.attack += stat.base_stat;
            break;
          case 'defense':
            totalStats.defense += stat.base_stat;
            break;
          case 'specialattack':
          case 'special-attack':
            totalStats.specialAttack += stat.base_stat;
            break;
          case 'specialdefense':
          case 'special-defense':
            totalStats.specialDefense += stat.base_stat;
            break;
          case 'speed':
            totalStats.speed += stat.base_stat;
            break;
        }
      });
    });

    // Calculate total of all stats
    totalStats.total = (
      totalStats.hp +
      totalStats.attack +
      totalStats.defense +
      totalStats.specialAttack +
      totalStats.specialDefense +
      totalStats.speed
    );

    return totalStats;
  };

  // Get stat value for a Pokemon
  const getStatValue = (pokemon: ICombatPokemon, statName: string) => {
    const stat = pokemon.stats.find(s =>
      s.stat.name === statName ||
      s.stat.name.replace('-', '') === statName
    );
    return stat ? stat.base_stat : 0;
  };

  // Calculate team type coverage
  const calculateTypeCoverage = (team: ICombatPokemon[]) => {
    const typeCount: Record<string, number> = {};

    team.forEach(pokemon => {
      pokemon.types.forEach(type => {
        typeCount[type] = (typeCount[type] || 0) + 1;
      });
    });

    return typeCount;
  };

  // Generate a team for the computer opponent
  const generateComputerTeam = () => {
    // Use storage Pokémon for computer team if available, otherwise use predetermined team
    if (teamData.storage.length >= 6) {
      // Use 6 random Pokémon from storage
      const shuffled = [...teamData.storage].sort(() => 0.5 - Math.random());
      setComputerTeam(shuffled.slice(0, 6));
      return;
    }

    // Mock team with preset Pokémon if not enough in storage
    setComputerTeam([
      {
        id: 6,
        name: "CHARIZARD",
        sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png",
        types: ["fire", "flying"],
        stats: [
          { base_stat: 78, effort: 0, stat: {
            name: "hp",
            url: ""
          } },
          { base_stat: 84, effort: 0, stat: {
            name: "attack",
            url: ""
          } },
          { base_stat: 78, effort: 0, stat: {
            name: "defense",
            url: ""
          } },
          { base_stat: 109, effort: 2, stat: {
            name: "special-attack",
            url: ""
          } },
          { base_stat: 85, effort: 0, stat: {
            name: "special-defense",
            url: ""
          } },
          { base_stat: 100, effort: 0, stat: {
            name: "speed",
            url: ""
          } }
        ],
        abilities: ["blaze", "solar-power"],
        moves: ["flamethrower", "dragon-claw", "air-slash", "earthquake"],
        level: 50,
        experience: 240
      },
      {
        id: 9,
        name: "BLASTOISE",
        sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png",
        types: ["water"],
        stats: [
          { base_stat: 79, effort: 0, stat: {
            name: "hp",
            url: ""
          } },
          { base_stat: 83, effort: 0, stat: {
            name: "attack",
            url: ""
          } },
          { base_stat: 100, effort: 0, stat: {
            name: "defense",
            url: ""
          } },
          { base_stat: 85, effort: 0, stat: {
            name: "special-attack",
            url: ""
          } },
          { base_stat: 105, effort: 3, stat: {
            name: "special-defense",
            url: ""
          } },
          { base_stat: 78, effort: 0, stat: {
            name: "speed",
            url: ""
          } }
        ],
        abilities: ["torrent", "rain-dish"],
        moves: ["hydro-pump", "ice-beam", "flash-cannon", "dark-pulse"],
        level: 50,
        experience: 239
      },
      // Add more computer team members as needed
    ]);
  };

  // Run battle simulation between user team and computer team
  const runBattleSimulation = () => {
    if (teamData.active.length === 0) {
      toast.error("You need Pokémon in your active team to battle!");
      return;
    }

    // Generate computer team if needed
    if (computerTeam.length === 0) {
      generateComputerTeam();
    }

    setIsBattling(true);
    setSimulationLog([{ text: "Battle started!", type: "info" }]);

    // Start battle simulation
    const battleResult = simulateBattle(teamData.active, computerTeam);

    // Display battle results
    setSimulationLog(prev => [
      ...prev,
      { text: "Battle finished!", type: "info" },
      { text: battleResult ? "You won the battle!" : "Computer won the battle!", type: battleResult ? "heal" : "attack" }
    ]);

    setTimeout(() => {
      setIsBattling(false);
      toast(battleResult ? "Victory! Your team won the battle!" : "Defeat! Better luck next time!");
    }, 1000);
  };

  // Simple battle simulation logic
  const simulateBattle = (userTeam: ICombatPokemon[], cpuTeam: ICombatPokemon[]) => {
    const userTeamCopy = [...userTeam];
    const cpuTeamCopy = [...cpuTeam];

    // Super simplified battle system
    let userTurn = true;

    const addLogEntry = (message: string, type?: 'attack' | 'info' | 'critical' | 'heal') => {
      setSimulationLog(prev => [...prev, { text: message, type }]);
    };

    // Continue battle until one team has no Pokémon left
    while (userTeamCopy.length > 0 && cpuTeamCopy.length > 0) {
      const attackingTeam = userTurn ? userTeamCopy : cpuTeamCopy;
      const defendingTeam = userTurn ? cpuTeamCopy : userTeamCopy;

      const attacker = attackingTeam[0];
      const defender = defendingTeam[0];

      // Calculate damage based on stats
      const attackStat = getStatValue(attacker, "attack");
      const defenseStat = getStatValue(defender, "defense");
      const speedStat = getStatValue(attacker, "speed");

      // Critical hit chance (based on speed)
      const criticalChance = speedStat / 512;
      const isCritical = Math.random() < criticalChance;

      // Calculate damage
      let damage = (attacker.level * 0.4 + 2) * attackStat / defenseStat;
      damage = damage / 50 + 2;

      // Apply critical hit and randomness
      if (isCritical) {
        damage *= 1.5;
      }

      // Add randomness factor (85% to 100% of calculated damage)
      damage *= (0.85 + Math.random() * 0.15);

      // Apply type effectiveness (simplified)
      const typeMultiplier = 1.0; // Would need complete type chart for real calculations
      damage *= typeMultiplier;

      // Round damage
      damage = Math.floor(damage);

      // Log the attack
      addLogEntry(
        `${attacker.name} attacks ${defender.name} for ${damage} damage${isCritical ? " (CRITICAL HIT!)" : ""}`,
        isCritical ? "critical" : "attack"
      );

      // Simulate KO
      if (damage > getStatValue(defender, "hp")) {
        // Pokémon fainted
        addLogEntry(`${defender.name} fainted!`, "info");
        defendingTeam.shift(); // Remove the fainted Pokémon

        if (defendingTeam.length > 0) {
          addLogEntry(`${userTurn ? "Computer" : "You"} sent out ${defendingTeam[0].name}!`, "info");
        }
      }

      // Switch turns
      userTurn = !userTurn;
    }

    // Return true if user won, false if CPU won
    return userTeamCopy.length > 0;
  };

  // Render a pokemon card
  const renderPokemonCard = (pokemon: ICombatPokemon, source: "active" | "dream" | "storage") => {
    return (
      <S.TeamSlot key={pokemon.id + pokemon.name}>
        <S.PokemonActions>
          <S.ActionButton onClick={() => openMoveModal(pokemon, source)} title="Move to another team">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 10L12 5L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 14L12 19L17 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </S.ActionButton>
          <S.ActionButton onClick={() => handleRemovePokemon(pokemon)} title="Remove from team">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </S.ActionButton>
        </S.PokemonActions>

        <LazyLoadImage
          src={pokemon.sprite}
          alt={pokemon.name}
          width={80}
          height={80}
          effect="blur"
        />

        <Text>{pokemon.name}</Text>
        {pokemon.originalName && pokemon.name !== pokemon.originalName && (
          <Text variant="light" style={{ fontSize: '0.75rem' }}>({pokemon.originalName})</Text>
        )}
        <Text variant="light">Lvl. {pokemon.level}</Text>

        <div style={{ display: 'flex', marginTop: '8px', gap: '4px' }}>
          {pokemon.types.map(type => (
            <TypeIcon key={type} type={type} size="sm" />
          ))}
        </div>

        {activeTab === "stats" && (
          <div style={{ marginTop: '8px', width: '100%' }}>
            <S.StatRow>
              <S.StatLabel>HP:</S.StatLabel>
              <S.StatValue>{getStatValue(pokemon, "hp")}</S.StatValue>
            </S.StatRow>
            <S.StatBar value={getStatValue(pokemon, "hp")} max={255} />

            <S.StatRow>
              <S.StatLabel>ATK:</S.StatLabel>
              <S.StatValue>{getStatValue(pokemon, "attack")}</S.StatValue>
            </S.StatRow>
            <S.StatBar value={getStatValue(pokemon, "attack")} max={255} />

            <S.StatRow>
              <S.StatLabel>DEF:</S.StatLabel>
              <S.StatValue>{getStatValue(pokemon, "defense")}</S.StatValue>
            </S.StatRow>
            <S.StatBar value={getStatValue(pokemon, "defense")} max={255} />

            <S.StatRow>
              <S.StatLabel>SPD:</S.StatLabel>
              <S.StatValue>{getStatValue(pokemon, "speed")}</S.StatValue>
            </S.StatRow>
            <S.StatBar value={getStatValue(pokemon, "speed")} max={255} />
          </div>
        )}
      </S.TeamSlot>
    );
  };

  // Render empty team slots
  const renderEmptySlot = (count: number, team: "active" | "dream" | "storage") => {
    const slots = [];
    for (let i = 0; i < count; i++) {
      slots.push(
        <S.TeamSlot
          key={`empty-${team}-${i}`}
          isEmpty
          onClick={() => setShowAddPokemonModal(true)}
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5 12H19" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <Text variant="light" style={{ marginTop: '8px' }}>Add Pokémon</Text>
        </S.TeamSlot>
      );
    }
    return slots;
  };

  // Render add Pokémon button for storage team
  const renderAddButton = () => {
    return (
      <S.TeamSlot
        isEmpty
        onClick={() => setShowAddPokemonModal(true)}
        style={{ minHeight: '150px' }}
      >
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 5V19" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M5 12H19" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <Text variant="light" style={{ marginTop: '8px' }}>Add Pokémon</Text>
      </S.TeamSlot>
    );
  };

  // Render team section with title and pokemon cards
  const renderTeamSection = (title: string, team: ICombatPokemon[], teamType: "active" | "dream" | "storage") => {
    const isActiveTeam = teamType === "active";
    const isDreamTeam = teamType === "dream";
    const emptySlots = isActiveTeam ? MAX_TEAM_SIZE - team.length : 0;

    return (
      <S.TeamSection>
        <S.TeamHeader>
          <S.TeamTitle>
            {title} ({team.length}{isActiveTeam ? `/${MAX_TEAM_SIZE}` : ''})
          </S.TeamTitle>

          {isDreamTeam && team.length > 0 && (
            <Button
              variant="primary"
              size="xl"
              onClick={() => {
                // Replace active team with dream team if dream team is valid
                if (team.length <= MAX_TEAM_SIZE) {
                  setTeamData(prev => ({
                    ...prev,
                    active: [...team]
                  }));
                  toast.success("Dream team activated!");
                } else {
                  toast.error(`Dream team has too many Pokémon! Maximum is ${MAX_TEAM_SIZE}.`);
                }
              }}
            >
              Activate Dream Team
            </Button>
          )}

          {isActiveTeam && team.length > 0 && (
            <Button
              variant="dark"
              size="xl"
              onClick={runBattleSimulation}
              disabled={isBattling}
            >
              Battle!
            </Button>
          )}
        </S.TeamHeader>

        <S.PokemonGrid>
          {team.map(pokemon => renderPokemonCard(pokemon, teamType))}
          {emptySlots > 0 && renderEmptySlot(emptySlots, teamType)}
          {teamType === "storage" && renderAddButton()}
        </S.PokemonGrid>
      </S.TeamSection>
    );
  };

  return (
    <>
      {/* Move Pokemon Modal */}
      <Modal open={showMoveModal}>
        <S.Modal>
          <Text as="h3">Move {selectedPokemon?.name}</Text>
          <Text>Select where to move this Pokémon:</Text>

          <S.ButtonsContainer>
            {targetTeam !== "active" && (
              <Button
                onClick={() => {
                  if (selectedPokemon) {
                    handleMovePokemon(selectedPokemon, "active");
                    setShowMoveModal(false);
                  }
                }}
                variant="primary"
                disabled={teamData.active.length >= MAX_TEAM_SIZE}
              >
                Active Team {teamData.active.length >= MAX_TEAM_SIZE && "(Full)"}
              </Button>
            )}

            {targetTeam !== "dream" && (
              <Button
                onClick={() => {
                  if (selectedPokemon) {
                    handleMovePokemon(selectedPokemon, "dream");
                    setShowMoveModal(false);
                  }
                }}
                variant="light"
              >
                Dream Team
              </Button>
            )}

            {targetTeam !== "storage" && (
              <Button
                onClick={() => {
                  if (selectedPokemon) {
                    handleMovePokemon(selectedPokemon, "storage");
                    setShowMoveModal(false);
                  }
                }}
                variant="dark"
              >
                Storage
              </Button>
            )}
          </S.ButtonsContainer>

          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <Button
              onClick={() => setShowMoveModal(false)}
              variant="light"
            >
              Cancel
            </Button>
          </div>
        </S.Modal>
      </Modal>

      {/* Add Pokemon Modal */}
      <Modal open={showAddPokemonModal}>
        <S.Modal>
          <Text as="h3">Add Pokémon to Team</Text>

          {isLoadingPokemonDetails ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
              <Loading label="Loading your Pokémon..." />
            </div>
          ) : availablePokemon.length > 0 ? (
            <>
              <Text>Select a Pokémon to add:</Text>

              <div style={{ marginTop: '1rem', maxHeight: '400px', overflowY: 'auto' }}>
                <S.PokemonGrid>
                  {availablePokemon.map(pokemon => (
                    <S.TeamSlot
                      key={pokemon.id + pokemon.name}
                      onClick={() => {
                        // Default to active team if not full, otherwise storage
                        const targetTeam = teamData.active.length < MAX_TEAM_SIZE ? "active" : "storage";
                        handleAddPokemon(pokemon, targetTeam);
                      }}
                    >
                      <LazyLoadImage
                        src={pokemon.sprite}
                        alt={pokemon.name}
                        width={60}
                        height={60}
                        effect="blur"
                      />

                      <Text>{pokemon.name}</Text>

                      <div style={{ display: 'flex', marginTop: '4px', gap: '4px' }}>
                        {pokemon.types.map(type => (
                          <TypeIcon key={type} type={type} size="sm" />
                        ))}
                      </div>

                      <div style={{ fontSize: '0.75rem', marginTop: '4px', color: '#6B7280' }}>
                        Tap to add
                      </div>
                    </S.TeamSlot>
                  ))}
                </S.PokemonGrid>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
              <Text>No Pokémon available to add</Text>
              <Text variant="light" style={{ marginTop: '0.5rem' }}>
                Catch more Pokémon or remove some from your teams
              </Text>
            </div>
          )}

          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <Button
              onClick={() => setShowAddPokemonModal(false)}
              variant="light"
            >
              Close
            </Button>
          </div>
        </S.Modal>
      </Modal>

      <S.Container style={{ marginBottom: navHeight }}>
        <Header
          title="Combat Team"
          subtitle="Build and manage your battle teams"
          backTo="/pokemons"
        />

        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
            <Loading label="Loading your teams..." />
          </div>
        ) : (
          <>
            <S.TabsContainer>
              <S.Tab
                active={activeTab === "teams"}
                onClick={() => setActiveTab("teams")}
              >
                Teams
              </S.Tab>
              <S.Tab
                active={activeTab === "stats"}
                onClick={() => setActiveTab("stats")}
              >
                Stats & Analysis
              </S.Tab>
              <S.Tab
                active={activeTab === "combat"}
                onClick={() => setActiveTab("combat")}
              >
                Combat Simulator
              </S.Tab>
            </S.TabsContainer>

            {activeTab === "teams" && (
              <>
                {renderTeamSection("Active Team", teamData.active, "active")}
                {renderTeamSection("Dream Team", teamData.dream, "dream")}
                {renderTeamSection("Storage", teamData.storage, "storage")}

                {teamData.active.length === 0 &&
                 teamData.dream.length === 0 &&
                 teamData.storage.length === 0 &&
                 availablePokemon.length === 0 && (
                  <S.EmptyState>
                    <Text>You haven't caught any Pokémon yet.</Text>
                    <Text>Catch Pokémon to build your battle teams!</Text>
                    <Button onClick={() => navigate("/pokemons")} variant="primary" style={{ marginTop: '1rem' }}>
                      Explore Pokémon
                    </Button>
                  </S.EmptyState>
                )}
              </>
            )}

            {activeTab === "stats" && (
              <>
                {(teamData.active.length > 0 || teamData.dream.length > 0) ? (
                  <>
                    <S.TeamSection>
                      <S.TeamTitle>Team Stats Analysis</S.TeamTitle>

                      <S.StatsContainer>
                        {teamData.active.length > 0 && (
                          <S.StatCard>
                            <Text as="h4">Active Team</Text>

                            <div style={{ marginTop: '1rem' }}>
                              <Text>Total Base Stats: {calculateTeamStats(teamData.active).total}</Text>

                              <div style={{ marginTop: '1rem' }}>
                                <S.StatRow>
                                  <S.StatLabel>HP Total:</S.StatLabel>
                                  <S.StatValue>{calculateTeamStats(teamData.active).hp}</S.StatValue>
                                </S.StatRow>
                                <S.StatRow>
                                  <S.StatLabel>Attack Total:</S.StatLabel>
                                  <S.StatValue>{calculateTeamStats(teamData.active).attack}</S.StatValue>
                                </S.StatRow>
                                <S.StatRow>
                                  <S.StatLabel>Defense Total:</S.StatLabel>
                                  <S.StatValue>{calculateTeamStats(teamData.active).defense}</S.StatValue>
                                </S.StatRow>
                                <S.StatRow>
                                  <S.StatLabel>Sp. Attack Total:</S.StatLabel>
                                  <S.StatValue>{calculateTeamStats(teamData.active).specialAttack}</S.StatValue>
                                </S.StatRow>
                                <S.StatRow>
                                  <S.StatLabel>Sp. Defense Total:</S.StatLabel>
                                  <S.StatValue>{calculateTeamStats(teamData.active).specialDefense}</S.StatValue>
                                </S.StatRow>
                                <S.StatRow>
                                  <S.StatLabel>Speed Total:</S.StatLabel>
                                  <S.StatValue>{calculateTeamStats(teamData.active).speed}</S.StatValue>
                                </S.StatRow>
                              </div>
                            </div>
                          </S.StatCard>
                        )}

                        {teamData.dream.length > 0 && (
                          <S.StatCard>
                            <Text as="h4">Dream Team</Text>

                            <div style={{ marginTop: '1rem' }}>
                              <Text>Total Base Stats: {calculateTeamStats(teamData.dream).total}</Text>
                            </div>
                          </S.StatCard>
                        )}
                      </S.StatsContainer>
                    </S.TeamSection>

                    <S.TeamSection>
                      <S.TeamTitle>Type Coverage Analysis</S.TeamTitle>

                      <S.StatsContainer>
                        {teamData.active.length > 0 && (
                          <S.StatCard>
                            <Text as="h4">Active Team Types</Text>

                            <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                              {Object.entries(calculateTypeCoverage(teamData.active)).map(([type, count]) => (
                                <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <TypeIcon type={type} size="sm" />
                                  <Text>×{count}</Text>
                                </div>
                              ))}
                            </div>
                          </S.StatCard>
                        )}

                        {teamData.dream.length > 0 && (
                          <S.StatCard>
                            <Text as="h4">Dream Team Types</Text>

                            <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                              {Object.entries(calculateTypeCoverage(teamData.dream)).map(([type, count]) => (
                                <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <TypeIcon type={type} size="sm" />
                                  <Text>×{count}</Text>
                                </div>
                              ))}
                            </div>
                          </S.StatCard>
                        )}
                      </S.StatsContainer>
                    </S.TeamSection>
                  </>
                ) : (
                  <S.EmptyState>
                    <Text>Add Pokémon to your teams to see stats and analysis</Text>
                    <Button onClick={() => setActiveTab("teams")} variant="primary" style={{ marginTop: '1rem' }}>
                      Go to Teams
                    </Button>
                  </S.EmptyState>
                )}
              </>
            )}

            {activeTab === "combat" && (
              <>
                {teamData.active.length > 0 ? (
                  <>
                    <S.TeamSection>
                      <S.TeamTitle>Combat Simulator</S.TeamTitle>

                      <S.CombatSimulatorContainer>
                        <S.TeamSide>
                          <Text as="h4">Your Team</Text>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                            {teamData.active.map(pokemon => (
                              <div key={pokemon.id} style={{ padding: '0.5rem', textAlign: 'center' }}>
                                <LazyLoadImage
                                  src={pokemon.sprite}
                                  alt={pokemon.name}
                                  width={60}
                                  height={60}
                                />
                                <div style={{ fontSize: '0.75rem', fontWeight: 500 }}>{pokemon.name}</div>
                              </div>
                            ))}
                          </div>
                        </S.TeamSide>

                        <S.TeamSide>
                          <Text as="h4">Computer Team</Text>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                            {computerTeam.length > 0 ? (
                              computerTeam.map(pokemon => (
                                <div key={pokemon.id} style={{ padding: '0.5rem', textAlign: 'center' }}>
                                  <LazyLoadImage
                                    src={pokemon.sprite}
                                    alt={pokemon.name}
                                    width={60}
                                    height={60}
                                  />
                                  <div style={{ fontSize: '0.75rem', fontWeight: 500 }}>{pokemon.name}</div>
                                </div>
                              ))
                            ) : (
                              <Text>Computer team will be generated when battle starts</Text>
                            )}
                          </div>
                        </S.TeamSide>
                      </S.CombatSimulatorContainer>

                      <div style={{ textAlign: 'center', margin: '2rem 0' }}>
                        <Button
                          onClick={runBattleSimulation}
                          variant="primary"
                          size="lg"
                          disabled={isBattling}
                        >
                          {isBattling ? "Battle in progress..." : "Start Battle"}
                        </Button>
                      </div>

                      {simulationLog.length > 0 && (
                        <>
                          <Text as="h4">Battle Log</Text>
                          <S.BattleLog>
                            {simulationLog.map((entry, index) => (
                              <S.LogEntry key={index} type={entry.type}>
                                {entry.text}
                              </S.LogEntry>
                            ))}
                          </S.BattleLog>
                        </>
                      )}
                    </S.TeamSection>
                  </>
                ) : (
                  <S.EmptyState>
                    <Text>You need Pokémon in your active team to use the Combat Simulator</Text>
                    <Button onClick={() => setActiveTab("teams")} variant="primary" style={{ marginTop: '1rem' }}>
                      Go to Teams
                    </Button>
                  </S.EmptyState>
                )}
              </>
            )}
          </>
        )}
      </S.Container>

      <Navbar ref={navRef} />
    </>
  );
};

export default CombatTeam;
