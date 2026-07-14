import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import gsap from "gsap";

import {
  Button,
  Navbar,
  Text,
  Header,
  Loading,
  Modal,
  TypeIcon,
} from "@/components/ui";
import { ICombatPokemon } from "@/types/pokemon";
import { useAuth } from "@/contexts";
import { useTeamData, MAX_TEAM_SIZE } from "./hooks/useTeamData";
import { useBattleSimulator } from "./hooks/useBattleSimulator";
import * as S from "./index.style";

const CombatTeam: React.FC = () => {
  const navigate = useNavigate();
  const navRef = useRef<HTMLDivElement>(null);
  const battleLogRef = useRef<HTMLDivElement>(null);
  const playerSpriteRef = useRef<HTMLImageElement>(null);
  const computerSpriteRef = useRef<HTMLImageElement>(null);
  const prevPlayerId = useRef<number | null>(null);
  const prevComputerId = useRef<number | null>(null);
  const prevPlayerHp = useRef<number | null>(null);
  const prevComputerHp = useRef<number | null>(null);
  const { isAuthenticated } = useAuth();

  const [activeTab, setActiveTab] = useState<string>("teams");
  const [selectedPokemon, setSelectedPokemon] = useState<ICombatPokemon | null>(
    null,
  );
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [sourceTeamForMove, setSourceTeamForMove] = useState<
    "active" | "dream" | "storage"
  >("active");
  const [showAddPokemonModal, setShowAddPokemonModal] = useState(false);

  const {
    teamData,
    isLoading,
    movePokemon,
    removePokemon,
    isInStorage,
    activateDreamTeam,
  } = useTeamData(isAuthenticated);

  const { simulationLog, isBattling, computerTeam, runBattle, resetBattle } =
    useBattleSimulator(teamData.storage);

  const latestLog =
    simulationLog.length > 0 ? simulationLog[simulationLog.length - 1] : null;
  const activePlayer = latestLog?.activePlayer;
  const activeComputer = latestLog?.activeComputer;
  const playerHp = latestLog?.playerHp ?? 0;
  const computerHp = latestLog?.computerHp ?? 0;
  const playerMaxHp = latestLog?.playerMaxHp ?? 1;
  const computerMaxHp = latestLog?.computerMaxHp ?? 1;

  useEffect(() => {
    if (battleLogRef.current) {
      battleLogRef.current.scrollTop = battleLogRef.current.scrollHeight;
    }
  }, [simulationLog]);

  useEffect(() => {
    if (!playerSpriteRef.current || !activePlayer) return;

    if (playerHp <= 0) {
      gsap.to(playerSpriteRef.current, { y: 50, opacity: 0, duration: 0.5 });
    } else if (prevPlayerId.current !== activePlayer.id) {
      gsap.fromTo(
        playerSpriteRef.current,
        { x: -100, opacity: 0, y: 0, filter: "brightness(1)" },
        { x: 0, opacity: 1, duration: 0.5, ease: "back.out(1.5)" },
      );
    } else if (
      prevPlayerHp.current !== null &&
      playerHp < prevPlayerHp.current
    ) {
      gsap
        .timeline()
        .set(playerSpriteRef.current, { filter: "brightness(2) contrast(1.5)" })
        .to(playerSpriteRef.current, { x: -10, duration: 0.05 })
        .to(playerSpriteRef.current, { x: 10, duration: 0.05 })
        .set(playerSpriteRef.current, { filter: "brightness(1) contrast(1)" })
        .to(playerSpriteRef.current, { x: -10, duration: 0.05 })
        .to(playerSpriteRef.current, { x: 10, duration: 0.05 })
        .to(playerSpriteRef.current, { x: 0, duration: 0.05 });

      if (computerSpriteRef.current) {
        gsap
          .timeline()
          .to(computerSpriteRef.current, {
            x: -30,
            duration: 0.1,
            ease: "power1.in",
          })
          .to(computerSpriteRef.current, {
            x: 0,
            duration: 0.2,
            ease: "power1.out",
          });
      }
    }
    prevPlayerId.current = activePlayer.id;
    prevPlayerHp.current = playerHp;
  }, [activePlayer, playerHp]);

  useEffect(() => {
    if (!computerSpriteRef.current || !activeComputer) return;

    if (computerHp <= 0) {
      gsap.to(computerSpriteRef.current, { y: 50, opacity: 0, duration: 0.5 });
    } else if (prevComputerId.current !== activeComputer.id) {
      gsap.fromTo(
        computerSpriteRef.current,
        { x: 100, opacity: 0, y: 0, filter: "brightness(1)" },
        { x: 0, opacity: 1, duration: 0.5, ease: "back.out(1.5)" },
      );
    } else if (
      prevComputerHp.current !== null &&
      computerHp < prevComputerHp.current
    ) {
      gsap
        .timeline()
        .set(computerSpriteRef.current, {
          filter: "brightness(2) contrast(1.5)",
        })
        .to(computerSpriteRef.current, { x: -10, duration: 0.05 })
        .to(computerSpriteRef.current, { x: 10, duration: 0.05 })
        .set(computerSpriteRef.current, { filter: "brightness(1) contrast(1)" })
        .to(computerSpriteRef.current, { x: -10, duration: 0.05 })
        .to(computerSpriteRef.current, { x: 10, duration: 0.05 })
        .to(computerSpriteRef.current, { x: 0, duration: 0.05 });

      if (playerSpriteRef.current) {
        gsap
          .timeline()
          .to(playerSpriteRef.current, {
            x: 30,
            duration: 0.1,
            ease: "power1.in",
          })
          .to(playerSpriteRef.current, {
            x: 0,
            duration: 0.2,
            ease: "power1.out",
          });
      }
    }
    prevComputerId.current = activeComputer.id;
    prevComputerHp.current = computerHp;
  }, [activeComputer, computerHp]);

  // ── Helpers ────────────────────────────────────────────────────────────────

  const getStatValue = (pokemon: ICombatPokemon, statName: string): number => {
    const stat = pokemon.stats.find(
      (s) =>
        s.stat.name === statName || s.stat.name.replace("-", "") === statName,
    );
    return stat ? stat.base_stat : 0;
  };

  const calculateTeamStats = (team: ICombatPokemon[]) => {
    const totals = {
      hp: 0,
      attack: 0,
      defense: 0,
      specialAttack: 0,
      specialDefense: 0,
      speed: 0,
      total: 0,
    };
    team.forEach((pokemon) => {
      pokemon.stats.forEach(({ stat, base_stat }) => {
        const n = stat.name.replace("-", "");
        if (n === "hp") totals.hp += base_stat;
        else if (n === "attack") totals.attack += base_stat;
        else if (n === "defense") totals.defense += base_stat;
        else if (n === "specialattack") totals.specialAttack += base_stat;
        else if (n === "specialdefense") totals.specialDefense += base_stat;
        else if (n === "speed") totals.speed += base_stat;
      });
    });
    totals.total =
      totals.hp +
      totals.attack +
      totals.defense +
      totals.specialAttack +
      totals.specialDefense +
      totals.speed;
    return totals;
  };

  const calculateTypeCoverage = (team: ICombatPokemon[]) => {
    const typeCount: Record<string, number> = {};
    team.forEach((pokemon) => {
      pokemon.types.forEach((type) => {
        typeCount[type] = (typeCount[type] || 0) + 1;
      });
    });
    return typeCount;
  };

  // ── Drag & Drop ────────────────────────────────────────────────────────────

  const handleDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    pokemon: ICombatPokemon,
    team: "active" | "dream" | "storage",
  ) => {
    event.dataTransfer.setData(
      "application/json",
      JSON.stringify({ pokemon, sourceTeam: team }),
    );
    event.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (
    event: React.DragEvent<HTMLDivElement>,
    targetTeam: "active" | "dream" | "storage",
  ) => {
    event.preventDefault();
    try {
      const { pokemon, sourceTeam } = JSON.parse(
        event.dataTransfer.getData("application/json"),
      ) as {
        pokemon: ICombatPokemon;
        sourceTeam: "active" | "dream" | "storage";
      };
      if (sourceTeam === targetTeam) return;
      movePokemon(pokemon, targetTeam);
    } catch (error) {
      console.error("Error handling drop:", error);
    }
  };

  // ── Modal helpers ──────────────────────────────────────────────────────────

  const openMoveModal = (
    pokemon: ICombatPokemon,
    team: "active" | "dream" | "storage",
  ) => {
    setSelectedPokemon(pokemon);
    setSourceTeamForMove(team);
    setShowMoveModal(true);
  };

  // ── Render helpers ─────────────────────────────────────────────────────────

  const renderPokemonCard = (
    pokemon: ICombatPokemon,
    source: "active" | "dream" | "storage",
  ) => {
    const isWishlist = source === "dream" && !isInStorage(pokemon);
    return (
      <S.TeamSlot
        key={pokemon.id + pokemon.name}
        draggable
        onDragStart={(e) => handleDragStart(e, pokemon, source)}
        className={`pokemon-card ${source}-pokemon ${isWishlist ? "wishlist-pokemon" : ""}`}
        style={isWishlist ? { filter: "grayscale(1)", opacity: 0.7 } : {}}
      >
        <S.PokemonActions>
          <S.ActionButton
            onClick={() => openMoveModal(pokemon, source)}
            title="Move to another team"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 10L12 5L17 10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7 14L12 19L17 14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </S.ActionButton>
          {source !== "storage" && (
            <S.ActionButton
              onClick={() => removePokemon(pokemon, source)}
              title="Remove from team"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 18L18 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </S.ActionButton>
          )}
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
          <Text variant="light" style={{ fontSize: "0.75rem" }}>
            ({pokemon.originalName})
          </Text>
        )}
        <Text variant="light">Lvl. {pokemon.level}</Text>

        {isWishlist && (
          <Text
            variant="light"
            style={{ fontSize: "0.7rem", color: "#f87171", marginTop: "4px" }}
          >
            Not caught yet
          </Text>
        )}

        <div style={{ display: "flex", marginTop: "8px", gap: "4px" }}>
          {pokemon.types.map((type) => (
            <TypeIcon key={type} type={type} size="sm" />
          ))}
        </div>

        {activeTab === "stats" && (
          <div style={{ marginTop: "8px", width: "100%" }}>
            {(["hp", "attack", "defense", "speed"] as const).map((stat) => (
              <React.Fragment key={stat}>
                <S.StatRow>
                  <S.StatLabel>{stat.toUpperCase()}:</S.StatLabel>
                  <S.StatValue>{getStatValue(pokemon, stat)}</S.StatValue>
                </S.StatRow>
                <S.StatBar value={getStatValue(pokemon, stat)} max={255} />
              </React.Fragment>
            ))}
          </div>
        )}
      </S.TeamSlot>
    );
  };

  const renderEmptySlot = (
    count: number,
    team: "active" | "dream" | "storage",
  ) =>
    Array.from({ length: count }, (_, i) => (
      <S.TeamSlot
        key={`empty-${team}-${i}`}
        isEmpty
        onClick={() => setShowAddPokemonModal(true)}
      >
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 5V19"
            stroke="#9CA3AF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5 12H19"
            stroke="#9CA3AF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <Text variant="light" style={{ marginTop: "8px" }}>
          Add Pokémon
        </Text>
      </S.TeamSlot>
    ));

  const renderTeamSection = (
    title: string,
    team: ICombatPokemon[],
    teamType: "active" | "dream" | "storage",
  ) => {
    const isActive = teamType === "active";
    const isDream = teamType === "dream";
    const emptySlots = isActive ? MAX_TEAM_SIZE - team.length : 0;

    return (
      <S.TeamSection>
        <S.TeamHeader>
          <S.TeamTitle>
            {title} ({team.length}
            {isActive ? `/${MAX_TEAM_SIZE}` : ""})
          </S.TeamTitle>

          {isDream && team.length > 0 && (
            <Button variant="primary" size="sm" onClick={activateDreamTeam}>
              Activate Dream Team
            </Button>
          )}

          {isActive && team.length > 0 && (
            <Button
              variant="dark"
              size="xl"
              onClick={() => runBattle(team)}
              disabled={isBattling}
            >
              Battle!
            </Button>
          )}
        </S.TeamHeader>

        <S.PokemonGrid
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, teamType)}
          className={`drop-target ${teamType}-team`}
        >
          {team.map((pokemon) => renderPokemonCard(pokemon, teamType))}
          {emptySlots > 0 && renderEmptySlot(emptySlots, teamType)}
          {teamType === "storage" && (
            <S.TeamSlot
              isEmpty
              onClick={() => setShowAddPokemonModal(true)}
              style={{ minHeight: "150px" }}
            >
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 5V19"
                  stroke="#9CA3AF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5 12H19"
                  stroke="#9CA3AF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <Text variant="light" style={{ marginTop: "8px" }}>
                Add Pokémon
              </Text>
            </S.TeamSlot>
          )}
        </S.PokemonGrid>
      </S.TeamSection>
    );
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Move Pokémon Modal */}
      <Modal open={showMoveModal}>
        <S.Modal>
          <Text as="h3">Move {selectedPokemon?.name}</Text>
          <Text>Select where to move this Pokémon:</Text>

          <S.ButtonsContainer>
            {sourceTeamForMove !== "active" && (
              <Button
                onClick={() => {
                  if (selectedPokemon) {
                    movePokemon(selectedPokemon, "active");
                    setShowMoveModal(false);
                  }
                }}
                variant="primary"
                disabled={teamData.active.length >= MAX_TEAM_SIZE}
              >
                Active Team{" "}
                {teamData.active.length >= MAX_TEAM_SIZE && "(Full)"}
              </Button>
            )}
            {sourceTeamForMove !== "dream" && (
              <Button
                onClick={() => {
                  if (selectedPokemon) {
                    movePokemon(selectedPokemon, "dream");
                    setShowMoveModal(false);
                  }
                }}
                variant="light"
              >
                Dream Team
              </Button>
            )}
            {sourceTeamForMove !== "storage" && (
              <Button
                onClick={() => {
                  if (selectedPokemon) {
                    movePokemon(selectedPokemon, "storage");
                    setShowMoveModal(false);
                  }
                }}
                variant="dark"
              >
                Storage
              </Button>
            )}
          </S.ButtonsContainer>

          <div style={{ marginTop: "1rem", textAlign: "center" }}>
            <Button onClick={() => setShowMoveModal(false)} variant="light">
              Cancel
            </Button>
          </div>
        </S.Modal>
      </Modal>

      {/* Add Pokémon Modal — storage as pool */}
      <Modal open={showAddPokemonModal}>
        <S.Modal>
          <Text as="h3">Add Pokémon to Team</Text>
          {teamData.storage.length > 0 ? (
            <>
              <Text>
                Select a Pokémon from storage to add to your active team:
              </Text>
              <div
                style={{
                  marginTop: "1rem",
                  maxHeight: "400px",
                  overflowY: "auto",
                }}
              >
                <S.PokemonGrid>
                  {teamData.storage.map((pokemon) => (
                    <S.TeamSlot
                      key={pokemon.id + pokemon.name}
                      onClick={() => {
                        const target =
                          teamData.active.length < MAX_TEAM_SIZE
                            ? "active"
                            : "dream";
                        movePokemon(pokemon, target);
                        setShowAddPokemonModal(false);
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
                      <div
                        style={{
                          display: "flex",
                          marginTop: "4px",
                          gap: "4px",
                        }}
                      >
                        {pokemon.types.map((type) => (
                          <TypeIcon key={type} type={type} size="sm" />
                        ))}
                      </div>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          marginTop: "4px",
                          color: "#6B7280",
                        }}
                      >
                        Tap to add
                      </div>
                    </S.TeamSlot>
                  ))}
                </S.PokemonGrid>
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
              <Text>No Pokémon available to add</Text>
              <Text variant="light" style={{ marginTop: "0.5rem" }}>
                Catch more Pokémon or remove some from your teams
              </Text>
            </div>
          )}
          <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
            <Button
              onClick={() => setShowAddPokemonModal(false)}
              variant="light"
            >
              Close
            </Button>
          </div>
        </S.Modal>
      </Modal>

      <S.Container>
        <Header
          title="Combat Team"
          subtitle="Build and manage your battle teams"
          backTo="/pokemons"
        />

        {isLoading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "2rem",
            }}
          >
            <Loading label="Loading your teams..." />
          </div>
        ) : (
          <>
            <S.TabsContainer>
              {(["teams", "stats", "combat"] as const).map((tab) => (
                <S.Tab
                  key={tab}
                  active={activeTab === tab}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === "teams"
                    ? "Teams"
                    : tab === "stats"
                      ? "Stats & Analysis"
                      : "Combat Simulator"}
                </S.Tab>
              ))}
            </S.TabsContainer>

            {/* ── Teams Tab ── */}
            {activeTab === "teams" && (
              <>
                {renderTeamSection("Active Team", teamData.active, "active")}
                {renderTeamSection("Dream Team", teamData.dream, "dream")}
                {renderTeamSection("Storage", teamData.storage, "storage")}

                {teamData.active.length === 0 &&
                  teamData.dream.length === 0 &&
                  teamData.storage.length === 0 && (
                    <S.EmptyState>
                      <Text>You haven't caught any Pokémon yet.</Text>
                      <Text>Catch Pokémon to build your battle teams!</Text>
                      <Button
                        onClick={() => navigate("/pokemons")}
                        variant="primary"
                        style={{ marginTop: "1rem" }}
                      >
                        Explore Pokémon
                      </Button>
                    </S.EmptyState>
                  )}
              </>
            )}

            {/* ── Stats Tab ── */}
            {activeTab === "stats" && (
              <>
                {teamData.active.length > 0 || teamData.dream.length > 0 ? (
                  <>
                    <S.TeamSection>
                      <S.TeamTitle>Team Stats Analysis</S.TeamTitle>
                      <S.StatsContainer>
                        {(["active", "dream"] as const).map((key) => {
                          const team = teamData[key];
                          if (team.length === 0) return null;
                          const stats = calculateTeamStats(team);
                          return (
                            <S.StatCard key={key}>
                              <Text as="h4">
                                {key === "active"
                                  ? "Active Team"
                                  : "Dream Team"}
                              </Text>
                              <div style={{ marginTop: "1rem" }}>
                                <Text>Total Base Stats: {stats.total}</Text>
                                <div style={{ marginTop: "1rem" }}>
                                  {[
                                    { label: "HP Total", val: stats.hp },
                                    {
                                      label: "Attack Total",
                                      val: stats.attack,
                                    },
                                    {
                                      label: "Defense Total",
                                      val: stats.defense,
                                    },
                                    {
                                      label: "Sp. Attack Total",
                                      val: stats.specialAttack,
                                    },
                                    {
                                      label: "Sp. Defense Total",
                                      val: stats.specialDefense,
                                    },
                                    { label: "Speed Total", val: stats.speed },
                                  ].map(({ label, val }) => (
                                    <S.StatRow key={label}>
                                      <S.StatLabel>{label}:</S.StatLabel>
                                      <S.StatValue>{val}</S.StatValue>
                                    </S.StatRow>
                                  ))}
                                </div>
                              </div>
                            </S.StatCard>
                          );
                        })}
                      </S.StatsContainer>
                    </S.TeamSection>

                    <S.TeamSection>
                      <S.TeamTitle>Type Coverage Analysis</S.TeamTitle>
                      <S.StatsContainer>
                        {(["active", "dream"] as const).map((key) => {
                          const team = teamData[key];
                          if (team.length === 0) return null;
                          const coverage = calculateTypeCoverage(team);
                          return (
                            <S.StatCard key={key}>
                              <Text as="h4">
                                {key === "active"
                                  ? "Active Team Types"
                                  : "Dream Team Types"}
                              </Text>
                              <div
                                style={{
                                  marginTop: "1rem",
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: "0.5rem",
                                }}
                              >
                                {Object.entries(coverage).map(
                                  ([type, count]) => (
                                    <div
                                      key={type}
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "4px",
                                      }}
                                    >
                                      <TypeIcon type={type} size="sm" />
                                      <Text>×{count}</Text>
                                    </div>
                                  ),
                                )}
                              </div>
                            </S.StatCard>
                          );
                        })}
                      </S.StatsContainer>
                    </S.TeamSection>
                  </>
                ) : (
                  <S.EmptyState>
                    <Text>
                      Add Pokémon to your teams to see stats and analysis
                    </Text>
                    <Button
                      onClick={() => setActiveTab("teams")}
                      variant="primary"
                      style={{ marginTop: "1rem" }}
                    >
                      Go to Teams
                    </Button>
                  </S.EmptyState>
                )}
              </>
            )}

            {/* ── Combat Simulator Tab ── */}
            {activeTab === "combat" && (
              <>
                {teamData.active.length > 0 ? (
                  <S.TeamSection>
                    <S.TeamTitle>Combat Simulator</S.TeamTitle>

                    <S.CombatSimulatorContainer>
                      <S.TeamSide>
                        <Text as="h4">Your Team</Text>
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "0.5rem",
                            justifyContent: "center",
                          }}
                        >
                          {teamData.active.map((pokemon) => (
                            <div
                              key={pokemon.id}
                              style={{ padding: "0.5rem", textAlign: "center" }}
                            >
                              <LazyLoadImage
                                src={pokemon.sprite}
                                alt={pokemon.name}
                                width={60}
                                height={60}
                              />
                              <div
                                style={{ fontSize: "0.75rem", fontWeight: 500 }}
                              >
                                {pokemon.name}
                              </div>
                            </div>
                          ))}
                        </div>
                      </S.TeamSide>

                      <S.TeamSide>
                        <Text as="h4">Computer Team</Text>
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "0.5rem",
                            justifyContent: "center",
                          }}
                        >
                          {computerTeam.length > 0 ? (
                            computerTeam.map((pokemon) => (
                              <div
                                key={pokemon.id}
                                style={{
                                  padding: "0.5rem",
                                  textAlign: "center",
                                }}
                              >
                                <LazyLoadImage
                                  src={pokemon.sprite}
                                  alt={pokemon.name}
                                  width={60}
                                  height={60}
                                />
                                <div
                                  style={{
                                    fontSize: "0.75rem",
                                    fontWeight: 500,
                                  }}
                                >
                                  {pokemon.name}
                                </div>
                              </div>
                            ))
                          ) : (
                            <Text>
                              Computer team will be generated when battle starts
                            </Text>
                          )}
                        </div>
                      </S.TeamSide>
                    </S.CombatSimulatorContainer>

                    <div
                      style={{
                        textAlign: "center",
                        margin: "2rem 0",
                        display: "flex",
                        justifyContent: "center",
                        gap: "1rem",
                      }}
                    >
                      <Button
                        onClick={() => runBattle(teamData.active)}
                        variant="primary"
                        size="lg"
                        disabled={isBattling}
                      >
                        {isBattling ? "Battle in progress..." : "Start Battle"}
                      </Button>
                      {simulationLog.length > 0 && !isBattling && (
                        <Button
                          onClick={resetBattle}
                          variant="secondary"
                          size="lg"
                        >
                          Next Battle
                        </Button>
                      )}
                    </div>

                    {simulationLog.length > 0 && (
                      <>
                        <S.ArenaContainer>
                          {activePlayer && (
                            <S.BattlerContainer isPlayer={true}>
                              <S.HpBox>
                                <Text
                                  style={{
                                    fontSize: "0.875rem",
                                    fontWeight: 600,
                                  }}
                                >
                                  {activePlayer.name}
                                </Text>
                                <S.HpBarOuter>
                                  <S.HpBarInner
                                    percentage={(playerHp / playerMaxHp) * 100}
                                  />
                                </S.HpBarOuter>
                                <Text
                                  style={{
                                    fontSize: "0.75rem",
                                    marginTop: "4px",
                                    textShadow: "none",
                                  }}
                                >
                                  {playerHp} / {playerMaxHp} HP
                                </Text>
                              </S.HpBox>
                              <S.BattlerSprite
                                ref={playerSpriteRef}
                                src={activePlayer.sprite}
                                alt={activePlayer.name}
                                isPlayer={true}
                              />
                            </S.BattlerContainer>
                          )}
                          {activeComputer && (
                            <S.BattlerContainer isPlayer={false}>
                              <S.HpBox>
                                <Text
                                  style={{
                                    fontSize: "0.875rem",
                                    fontWeight: 600,
                                  }}
                                >
                                  {activeComputer.name}
                                </Text>
                                <S.HpBarOuter>
                                  <S.HpBarInner
                                    percentage={
                                      (computerHp / computerMaxHp) * 100
                                    }
                                  />
                                </S.HpBarOuter>
                                <Text
                                  style={{
                                    fontSize: "0.75rem",
                                    marginTop: "4px",
                                    textShadow: "none",
                                  }}
                                >
                                  {computerHp} / {computerMaxHp} HP
                                </Text>
                              </S.HpBox>
                              <S.BattlerSprite
                                ref={computerSpriteRef}
                                src={activeComputer.sprite}
                                alt={activeComputer.name}
                                isPlayer={false}
                              />
                            </S.BattlerContainer>
                          )}
                        </S.ArenaContainer>

                        <Text as="h4">Battle Log</Text>
                        <S.BattleLog ref={battleLogRef}>
                          {simulationLog.map((entry, index) => (
                            <S.LogEntry
                              key={index}
                              type={entry.type}
                              attacker={entry.attacker}
                            >
                              {entry.text}
                            </S.LogEntry>
                          ))}
                        </S.BattleLog>
                      </>
                    )}
                  </S.TeamSection>
                ) : (
                  <S.EmptyState>
                    <Text>
                      You need Pokémon in your active team to use the Combat
                      Simulator
                    </Text>
                    <Button
                      onClick={() => setActiveTab("teams")}
                      variant="primary"
                      style={{ marginTop: "1rem" }}
                    >
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
