import React, { useState, useMemo } from "react";
import {
  IconShield,
  IconAlertTriangle,
  IconShieldCheck,
  IconShieldOff,
  IconBolt,
  IconArrowUp,
  IconDisc,
  IconEgg,
  IconSchool,
  IconSparkles,
  IconSword,
  IconWand,
  IconRefresh,
  IconChevronDown,
  IconTarget,
  IconDroplet,
  IconFlame,
  IconHeart,
  IconSnowflake,
  IconBiohazard,
  IconZzz,
  IconQuestionMark,
} from "@tabler/icons-react";
import * as S from "./MovesTab.style";
import { MoveDetailData } from "../../../hooks/queries";

// Helper to get special effect badges for a move
const getMoveEffectBadges = (move: MoveDetailData) => {
  const badges: Array<{
    icon: React.ReactNode;
    label: string;
    color: string;
    chance?: string;
  }> = [];

  // Priority (speed modifier)
  if (move.priority !== 0) {
    badges.push({
      icon: <IconBolt size={14} />,
      label:
        move.priority > 0
          ? `Priority +${move.priority}`
          : `Priority ${move.priority}`,
      color: move.priority > 0 ? "#16a34a" : "#dc2626",
    });
  }

  // Generation introduced
  if (move.generation && move.generation > 1) {
    badges.push({
      icon: <IconSparkles size={14} />,
      label: `Gen ${move.generation}`,
      color: "#6366f1",
    });
  }

  // Meta effects
  if (move.meta) {
    if (move.meta.critRate > 0) {
      badges.push({
        icon: <IconTarget size={14} />,
        label: "High Crit",
        color: "#ea580c",
      });
    }
    if (move.meta.flinchChance > 0) {
      badges.push({
        icon: <IconAlertTriangle size={14} />,
        label: `${move.meta.flinchChance}% Flinch`,
        color: "#ca8a04",
      });
    }
    if (move.meta.drain > 0) {
      badges.push({
        icon: <IconDroplet size={14} />,
        label: `${move.meta.drain}% Drain`,
        color: "#16a34a",
      });
    }
    if (move.meta.drain < 0) {
      badges.push({
        icon: <IconFlame size={14} />,
        label: `${Math.abs(move.meta.drain)}% Recoil`,
        color: "#dc2626",
      });
    }
    if (move.meta.healing > 0) {
      badges.push({
        icon: <IconHeart size={14} />,
        label: `${move.meta.healing}% Heal`,
        color: "#ec4899",
      });
    }
    if (move.meta.minHits && move.meta.maxHits) {
      const hitsLabel =
        move.meta.minHits === move.meta.maxHits
          ? `${move.meta.minHits} Hits`
          : `${move.meta.minHits}-${move.meta.maxHits} Hits`;
      badges.push({
        icon: <IconArrowUp size={14} />,
        label: hitsLabel,
        color: "#6366f1",
      });
    }
    if (move.meta.ailment) {
      let icon = <IconAlertTriangle size={14} />;
      let color = "#eab308";
      const name = move.meta.ailment.name;

      if (name === "burn") {
        icon = <IconFlame size={14} />;
        color = "#ef4444";
      } else if (name === "freeze") {
        icon = <IconSnowflake size={14} />;
        color = "#0ea5e9";
      } else if (name === "paralysis") {
        icon = <IconBolt size={14} />;
        color = "#eab308";
      } else if (name === "poison" || name === "toxic") {
        icon = <IconBiohazard size={14} />;
        color = "#a855f7";
      } else if (name === "sleep") {
        icon = <IconZzz size={14} />;
        color = "#6366f1";
      } else if (name === "confusion") {
        icon = <IconQuestionMark size={14} />;
        color = "#ec4899";
      }

      const chance = move.meta.ailment.chance ?? move.effectChance;

      badges.push({
        icon,
        label: `${name.charAt(0).toUpperCase() + name.slice(1)}`,
        color,
        chance: chance && chance > 0 ? `${chance}%` : undefined,
      });
    }
  }

  // Stat changes
  if (move.statChanges && move.statChanges.length > 0) {
    move.statChanges.forEach((statChange) => {
      let icon = <IconArrowUp size={14} />;
      let color = statChange.change > 0 ? "#16a34a" : "#dc2626";

      // Attempt to map stat to an icon
      if (statChange.stat.includes("attack")) {
        icon = <IconSword size={14} />;
        color = statChange.change > 0 ? "#ef4444" : "#991b1b";
      } else if (statChange.stat.includes("defense")) {
        icon = <IconShield size={14} />;
        color = statChange.change > 0 ? "#3b82f6" : "#1e40af";
      } else if (statChange.stat.includes("speed")) {
        icon = <IconBolt size={14} />;
        color = statChange.change > 0 ? "#eab308" : "#854d0e";
      }

      const chance = move.effectChance;

      badges.push({
        icon,
        label: `${statChange.stat.replace("-", " ")} ${
          statChange.change > 0 ? "+" : ""
        }${statChange.change}`,
        color,
        chance: chance && chance < 100 ? `${chance}%` : undefined,
      });
    });
  }

  return badges;
};

// Type effectiveness data for calculating defenses
const typeEffectiveness: Record<
  string,
  { weakTo: string[]; resistantTo: string[]; immuneTo: string[] }
> = {
  normal: { weakTo: ["fighting"], resistantTo: [], immuneTo: ["ghost"] },
  fire: {
    weakTo: ["water", "ground", "rock"],
    resistantTo: ["fire", "grass", "ice", "bug", "steel", "fairy"],
    immuneTo: [],
  },
  water: {
    weakTo: ["electric", "grass"],
    resistantTo: ["fire", "water", "ice", "steel"],
    immuneTo: [],
  },
  electric: {
    weakTo: ["ground"],
    resistantTo: ["electric", "flying", "steel"],
    immuneTo: [],
  },
  grass: {
    weakTo: ["fire", "ice", "poison", "flying", "bug"],
    resistantTo: ["water", "electric", "grass", "ground"],
    immuneTo: [],
  },
  ice: {
    weakTo: ["fire", "fighting", "rock", "steel"],
    resistantTo: ["ice"],
    immuneTo: [],
  },
  fighting: {
    weakTo: ["flying", "psychic", "fairy"],
    resistantTo: ["bug", "rock", "dark"],
    immuneTo: [],
  },
  poison: {
    weakTo: ["ground", "psychic"],
    resistantTo: ["grass", "fighting", "poison", "bug", "fairy"],
    immuneTo: [],
  },
  ground: {
    weakTo: ["water", "grass", "ice"],
    resistantTo: ["poison", "rock"],
    immuneTo: ["electric"],
  },
  flying: {
    weakTo: ["electric", "ice", "rock"],
    resistantTo: ["grass", "fighting", "bug"],
    immuneTo: ["ground"],
  },
  psychic: {
    weakTo: ["bug", "ghost", "dark"],
    resistantTo: ["fighting", "psychic"],
    immuneTo: [],
  },
  bug: {
    weakTo: ["fire", "flying", "rock"],
    resistantTo: ["grass", "fighting", "ground"],
    immuneTo: [],
  },
  rock: {
    weakTo: ["water", "grass", "fighting", "ground", "steel"],
    resistantTo: ["normal", "fire", "poison", "flying"],
    immuneTo: [],
  },
  ghost: {
    weakTo: ["ghost", "dark"],
    resistantTo: ["poison", "bug"],
    immuneTo: ["normal", "fighting"],
  },
  dragon: {
    weakTo: ["ice", "dragon", "fairy"],
    resistantTo: ["fire", "water", "electric", "grass"],
    immuneTo: [],
  },
  dark: {
    weakTo: ["fighting", "bug", "fairy"],
    resistantTo: ["ghost", "dark"],
    immuneTo: ["psychic"],
  },
  steel: {
    weakTo: ["fire", "fighting", "ground"],
    resistantTo: [
      "normal",
      "grass",
      "ice",
      "flying",
      "psychic",
      "bug",
      "rock",
      "dragon",
      "steel",
      "fairy",
    ],
    immuneTo: ["poison"],
  },
  fairy: {
    weakTo: ["poison", "steel"],
    resistantTo: ["fighting", "bug", "dark"],
    immuneTo: ["dragon"],
  },
};

interface MovesTabProps {
  moves: string[];
  moveDetails: MoveDetailData[];
  types: string[];
}

interface OrganizedMoves {
  levelUp: MoveDetailData[];
  machine: MoveDetailData[];
  egg: MoveDetailData[];
  tutor: MoveDetailData[];
  other: MoveDetailData[];
}

type MoveCategory = keyof OrganizedMoves;

const CATEGORY_CONFIG: Record<
  MoveCategory,
  { label: string; Icon: React.ElementType }
> = {
  levelUp: { label: "Level Up", Icon: IconArrowUp },
  machine: { label: "TM / HM", Icon: IconDisc },
  egg: { label: "Egg Moves", Icon: IconEgg },
  tutor: { label: "Move Tutor", Icon: IconSchool },
  other: { label: "Other", Icon: IconSparkles },
};

const INITIAL_VISIBLE = 8;

const MovesTab: React.FC<MovesTabProps> = ({ moveDetails, types }) => {
  const [expandedCategories, setExpandedCategories] = useState<
    Set<MoveCategory>
  >(new Set());
  const [activeFilter, setActiveFilter] = useState<
    "all" | "physical" | "special" | "status"
  >("all");

  // Organize moves by learn method
  const organizedMoves = useMemo<OrganizedMoves>(() => {
    const result: OrganizedMoves = {
      levelUp: [],
      machine: [],
      egg: [],
      tutor: [],
      other: [],
    };

    // Use a Set to track unique moves by name
    const seenMoves = new Set<string>();

    // If no moveDetails, return empty
    if (!moveDetails || moveDetails.length === 0) {
      return result;
    }

    moveDetails.forEach((move) => {
      // Skip duplicates
      if (seenMoves.has(move.name)) return;
      seenMoves.add(move.name);

      const method = move.learnMethod.toLowerCase();

      if (method === "level-up") {
        result.levelUp.push(move);
      } else if (method === "machine") {
        result.machine.push(move);
      } else if (method === "egg") {
        result.egg.push(move);
      } else if (method === "tutor") {
        result.tutor.push(move);
      } else {
        result.other.push(move);
      }
    });

    // Sort level-up moves by level
    result.levelUp.sort((a, b) => (a.level || 0) - (b.level || 0));

    // Sort machine moves alphabetically
    result.machine.sort((a, b) =>
      a.localizedName.localeCompare(b.localizedName),
    );

    return result;
  }, [moveDetails]);

  // Filter moves by damage class
  const filterMoves = (moves: MoveDetailData[]): MoveDetailData[] => {
    if (activeFilter === "all") return moves;
    return moves.filter((m) => m.damageClass === activeFilter);
  };

  // Calculate type defenses
  const typeDefenses = useMemo(() => {
    const defenses: Record<
      string,
      {
        effectiveness: "weak" | "resistant" | "immune" | "neutral";
        multiplier: number;
      }
    > = {};

    // Initialize all types with neutral
    Object.keys(typeEffectiveness).forEach((type) => {
      defenses[type] = { effectiveness: "neutral", multiplier: 1 };
    });

    // Apply each Pokémon type's effects
    types.forEach((pokemonType) => {
      const normalized = pokemonType.toLowerCase();
      const effects = typeEffectiveness[normalized];
      if (!effects) return;

      // Apply weaknesses
      effects.weakTo.forEach((type) => {
        const current = defenses[type];
        if (current.effectiveness === "neutral") {
          defenses[type] = { effectiveness: "weak", multiplier: 2 };
        } else if (current.effectiveness === "weak") {
          defenses[type] = { effectiveness: "weak", multiplier: 4 };
        } else if (current.effectiveness === "resistant") {
          defenses[type] = { effectiveness: "neutral", multiplier: 1 };
        }
      });

      // Apply resistances
      effects.resistantTo.forEach((type) => {
        const current = defenses[type];
        if (current.effectiveness === "neutral") {
          defenses[type] = { effectiveness: "resistant", multiplier: 0.5 };
        } else if (current.effectiveness === "resistant") {
          defenses[type] = { effectiveness: "resistant", multiplier: 0.25 };
        } else if (current.effectiveness === "weak") {
          defenses[type] = { effectiveness: "neutral", multiplier: 1 };
        }
      });

      // Apply immunities (override everything)
      effects.immuneTo.forEach((type) => {
        defenses[type] = { effectiveness: "immune", multiplier: 0 };
      });
    });

    return defenses;
  }, [types]);

  // Group type defenses by effectiveness
  const groupedDefenses = useMemo(() => {
    const weak: Array<{ type: string; multiplier: number }> = [];
    const resistant: Array<{ type: string; multiplier: number }> = [];
    const immune: Array<{ type: string; multiplier: number }> = [];

    Object.entries(typeDefenses).forEach(
      ([type, { effectiveness, multiplier }]) => {
        if (effectiveness === "weak") {
          weak.push({ type, multiplier });
        } else if (effectiveness === "resistant") {
          resistant.push({ type, multiplier });
        } else if (effectiveness === "immune") {
          immune.push({ type, multiplier });
        }
      },
    );

    // Sort by multiplier (most severe first)
    weak.sort((a, b) => b.multiplier - a.multiplier);
    resistant.sort((a, b) => a.multiplier - b.multiplier);

    return { weak, resistant, immune };
  }, [typeDefenses]);

  const toggleCategory = (category: MoveCategory) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const formatMultiplier = (m: number): string => {
    if (m === 0) return "0×";
    if (m === 0.25) return "¼×";
    if (m === 0.5) return "½×";
    if (m === 2) return "2×";
    if (m === 4) return "4×";
    return "1×";
  };

  const getMoveEffectBadges = (move: MoveDetailData) => {
    const badges: Array<{
      icon: React.ReactNode;
      label: string;
      color: string;
      chance?: string;
      isGrouped?: boolean;
      groupedStats?: Array<{
        icon: React.ReactNode;
        label: string;
        color: string;
      }>;
    }> = [];

    // Priority (speed modifier)
    if (move.priority !== 0) {
      badges.push({
        icon: <IconBolt size={14} />,
        label:
          move.priority > 0
            ? `Priority +${move.priority}`
            : `Priority ${move.priority}`,
        color: move.priority > 0 ? "#16a34a" : "#dc2626",
      });
    }

    // Generation introduced
    if (move.generation && move.generation > 1) {
      badges.push({
        icon: <IconSparkles size={14} />,
        label: `Gen ${move.generation}`,
        color: "#6366f1",
      });
    }

    // Meta effects
    if (move.meta) {
      if (move.meta.critRate > 0) {
        badges.push({
          icon: <IconTarget size={14} />,
          label: "High Crit",
          color: "#ea580c",
        });
      }
      if (move.meta.flinchChance > 0) {
        const chance = Math.max(move.meta.flinchChance, move.effectChance || 0);
        badges.push({
          icon: <IconAlertTriangle size={14} />,
          label: `${chance}% Flinch`,
          color: "#ca8a04",
        });
      }
      if (move.meta.drain > 0) {
        badges.push({
          icon: <IconDroplet size={14} />,
          label: `${move.meta.drain}% Drain`,
          color: "#16a34a",
        });
      }
      if (move.meta.drain < 0) {
        badges.push({
          icon: <IconFlame size={14} />,
          label: `${Math.abs(move.meta.drain)}% Recoil`,
          color: "#dc2626",
        });
      }
      if (move.meta.healing > 0) {
        badges.push({
          icon: <IconHeart size={14} />,
          label: `${move.meta.healing}% Heal`,
          color: "#ec4899",
        });
      }
      if (move.meta.minHits && move.meta.maxHits) {
        const hitsLabel =
          move.meta.minHits === move.meta.maxHits
            ? `${move.meta.minHits} Hits`
            : `${move.meta.minHits}-${move.meta.maxHits} Hits`;
        badges.push({
          icon: <IconArrowUp size={14} />,
          label: hitsLabel,
          color: "#6366f1",
        });
      }
      if (move.meta.ailment && move.meta.ailment.name !== "none") {
        let icon = <IconAlertTriangle size={14} />;
        let color = "#eab308";
        const name = move.meta.ailment.name;

        if (name === "burn") {
          icon = <IconFlame size={14} />;
          color = "#ef4444";
        } else if (name === "freeze") {
          icon = <IconSnowflake size={14} />;
          color = "#0ea5e9";
        } else if (name === "paralysis") {
          icon = <IconBolt size={14} />;
          color = "#eab308";
        } else if (name === "poison" || name === "toxic") {
          icon = <IconBiohazard size={14} />;
          color = "#a855f7";
        } else if (name === "sleep") {
          icon = <IconZzz size={14} />;
          color = "#6366f1";
        } else if (name === "confusion") {
          icon = <IconQuestionMark size={14} />;
          color = "#ec4899";
        }

        const chance = move.meta.ailment.chance ?? move.effectChance;

        badges.push({
          icon,
          label: `${name.charAt(0).toUpperCase() + name.slice(1)}`,
          color,
          chance: chance && chance > 0 ? `${chance}%` : undefined,
        });
      }
    }

    // Stat changes
    if (move.statChanges && move.statChanges.length > 0) {
      // Check for grouping possibility
      const statsCount = move.statChanges.length;
      const commonChance = move.effectChance;

      // If we have > 3 stats and they share a chance (often 10% for "All Stats Up" moves)
      if (statsCount > 3 && commonChance && commonChance < 100) {
        const groupedStats = move.statChanges.map((statChange) => {
          let icon = <IconArrowUp size={12} />;
          let color = statChange.change > 0 ? "#16a34a" : "#dc2626";

          if (statChange.stat.includes("attack")) {
            icon = <IconSword size={12} />;
            color = statChange.change > 0 ? "#ef4444" : "#991b1b";
          } else if (statChange.stat.includes("defense")) {
            icon = <IconShield size={12} />;
            color = statChange.change > 0 ? "#3b82f6" : "#1e40af";
          } else if (statChange.stat.includes("speed")) {
            icon = <IconBolt size={12} />;
            color = statChange.change > 0 ? "#eab308" : "#854d0e";
          }

          return {
            icon,
            label: `${statChange.stat.replace("special-", "Sp.").replace("-", " ")} ${statChange.change > 0 ? "+" : ""}${statChange.change}`,
            color,
          };
        });

        badges.push({
          icon: <IconSparkles size={14} />,
          label: "Grouped Stats",
          isGrouped: true,
          chance: `${commonChance}%`,
          color: "transparent",
          groupedStats,
        });
      } else {
        move.statChanges.forEach((statChange) => {
          let icon = <IconArrowUp size={14} />;
          let color = statChange.change > 0 ? "#16a34a" : "#dc2626";

          // Attempt to map stat to an icon
          if (statChange.stat.includes("attack")) {
            icon = <IconSword size={14} />;
            color = statChange.change > 0 ? "#ef4444" : "#991b1b";
          } else if (statChange.stat.includes("defense")) {
            icon = <IconShield size={14} />;
            color = statChange.change > 0 ? "#3b82f6" : "#1e40af";
          } else if (statChange.stat.includes("speed")) {
            icon = <IconBolt size={14} />;
            color = statChange.change > 0 ? "#eab308" : "#854d0e";
          }

          // Use effect chance for stat changes if available (e.g. 10% chance to lower defense)
          const chance = move.effectChance;

          badges.push({
            icon,
            label: `${statChange.stat.replace("-", " ")} ${
              statChange.change > 0 ? "+" : ""
            }${statChange.change}`,
            color,
            chance: chance && chance < 100 ? `${chance}%` : undefined,
          });
        });
      }
    }

    return badges;
  };

  const renderMoveCard = (move: MoveDetailData, category: MoveCategory) => {
    const moveType = move.type.toLowerCase();
    const effectBadges = getMoveEffectBadges(move);

    const renderBadgesRow = () => {
      if (effectBadges.length === 0) return null;
      return (
        <S.EffectBadgesRow>
          {effectBadges.map((badge, i) => {
            if (badge.isGrouped && badge.groupedStats) {
              return (
                <S.GroupedSplitBadge key={i} badgeColor={badge.color}>
                  <div className="left">{badge.chance}</div>
                  <div className="right">
                    {badge.groupedStats.map((stat, j) => (
                      <S.MiniStatBadge key={j} color={stat.color}>
                        {stat.icon}
                        {stat.label}
                      </S.MiniStatBadge>
                    ))}
                  </div>
                </S.GroupedSplitBadge>
              );
            } else if (badge.chance) {
              return (
                <S.SplitBadge key={i} badgeColor={badge.color}>
                  <div className="left">{badge.chance}</div>
                  <div className="right">
                    {badge.icon}
                    {badge.label}
                  </div>
                </S.SplitBadge>
              );
            } else {
              return (
                <S.EffectBadge key={i} badgeColor={badge.color}>
                  {badge.icon}
                  {badge.label}
                </S.EffectBadge>
              );
            }
          })}
        </S.EffectBadgesRow>
      );
    };

    // TM/HM style with disc icon
    if (category === "machine") {
      return (
        <S.TMDiscCard
          key={move.name}
          moveType={moveType}
          title={move.description || undefined}
        >
          <IconDisc size={36} className="disc-icon" />
          <div className="disc-info">
            <div className="move-name">
              {move.localizedName.replace(/-/g, " ")}
            </div>
            <div className="move-meta">
              {move.power && (
                <span className="meta-item">
                  PWR <span>{move.power}</span>
                </span>
              )}
              {move.accuracy && (
                <span className="meta-item">
                  ACC <span>{move.accuracy}%</span>
                </span>
              )}
              {move.pp && (
                <span className="meta-item">
                  PP <span>{move.pp}</span>
                </span>
              )}
            </div>
            {renderBadgesRow()}
          </div>
          <span className="type-badge">{moveType}</span>
        </S.TMDiscCard>
      );
    }

    // Egg move style
    if (category === "egg") {
      return (
        <S.EggMoveCard
          key={move.name}
          moveType={moveType}
          title={move.description || undefined}
        >
          <div className="egg-icon">
            <IconEgg size={18} />
          </div>
          <div className="egg-info">
            <div className="move-name">
              {move.localizedName.replace(/-/g, " ")}
            </div>
            <div className="move-stats">
              {move.power && (
                <span className="stat">
                  PWR <span>{move.power}</span>
                </span>
              )}
              {move.pp && (
                <span className="stat">
                  PP <span>{move.pp}</span>
                </span>
              )}
            </div>
            {renderBadgesRow()}
          </div>
          <span className="type-badge">{moveType}</span>
        </S.EggMoveCard>
      );
    }

    // Tutor move style
    if (category === "tutor") {
      return (
        <S.TutorMoveCard
          key={move.name}
          moveType={moveType}
          title={move.description || undefined}
        >
          <div className="tutor-icon">
            <IconSchool size={18} />
          </div>
          <div className="tutor-info">
            <div className="move-name">
              {move.localizedName.replace(/-/g, " ")}
            </div>
            <div className="move-stats">
              {move.power && (
                <span className="stat">
                  PWR <span>{move.power}</span>
                </span>
              )}
              {move.pp && (
                <span className="stat">
                  PP <span>{move.pp}</span>
                </span>
              )}
            </div>
            {renderBadgesRow()}
          </div>
          <span className="type-badge">{moveType}</span>
        </S.TutorMoveCard>
      );
    }

    // Default move card (level-up, other)
    return (
      <S.MoveCard
        key={move.name}
        moveType={moveType}
        title={move.description || undefined}
      >
        <div className="type-indicator" />
        <div className="move-content">
          <div className="move-header">
            <span className="move-name">
              {move.localizedName.replace(/-/g, " ")}
            </span>
            <span className="move-type-badge">
              <img
                src={`/src/assets/type-icon/${moveType}.png`}
                alt={moveType}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              {moveType}
            </span>
          </div>
          <div className="move-stats">
            {move.level && category === "levelUp" && (
              <span className="stat-chip level">
                <span className="label">Lv.</span>
                <span className="value">{move.level}</span>
              </span>
            )}
            {move.power && (
              <span className="stat-chip">
                <span className="label">PWR</span>
                <span className="value">{move.power}</span>
              </span>
            )}
            {move.accuracy && (
              <span className="stat-chip">
                <span className="label">ACC</span>
                <span className="value">{move.accuracy}%</span>
              </span>
            )}
            {move.pp && (
              <span className="stat-chip">
                <span className="label">PP</span>
                <span className="value">{move.pp}</span>
              </span>
            )}
            <span className={`damage-class ${move.damageClass}`}>
              {move.damageClass === "physical" && <IconSword size={14} />}
              {move.damageClass === "special" && <IconWand size={14} />}
              {move.damageClass === "status" && <IconRefresh size={14} />}
              {move.damageClass}
            </span>
          </div>
          {renderBadgesRow()}
        </div>
      </S.MoveCard>
    );
  };

  const renderMoveCategory = (category: MoveCategory) => {
    const moves = filterMoves(organizedMoves[category]);
    if (moves.length === 0) return null;

    const config = CATEGORY_CONFIG[category];
    const { Icon } = config;
    const isExpanded = expandedCategories.has(category);
    const visibleMoves = isExpanded ? moves : moves.slice(0, INITIAL_VISIBLE);
    const hasMore = moves.length > INITIAL_VISIBLE;

    return (
      <S.MoveCategoryCard key={category}>
        <S.MoveCategoryHeader>
          <div className="title-group">
            <Icon size={20} />
            <h4>{config.label}</h4>
            <span className="count">{moves.length}</span>
          </div>
          {hasMore && (
            <button
              className="expand-btn"
              onClick={() => toggleCategory(category)}
            >
              {isExpanded ? "Show Less" : `Show All (${moves.length})`}
            </button>
          )}
        </S.MoveCategoryHeader>
        <S.MoveGrid>
          {visibleMoves.map((move) => renderMoveCard(move, category))}
        </S.MoveGrid>
        {!isExpanded && hasMore && (
          <S.ShowMoreButton onClick={() => toggleCategory(category)}>
            <span>+{moves.length - INITIAL_VISIBLE} more moves</span>
            <IconChevronDown size={16} />
          </S.ShowMoreButton>
        )}
      </S.MoveCategoryCard>
    );
  };

  const hasAnyTypeDefenses =
    groupedDefenses.weak.length > 0 ||
    groupedDefenses.resistant.length > 0 ||
    groupedDefenses.immune.length > 0;

  return (
    <S.Container>
      {/* Type Defenses Section */}
      <S.TypeDefenseContainer>
        <S.SectionHeader>
          <IconShield size={22} />
          <h3>Type Defenses</h3>
        </S.SectionHeader>
        <S.TypeDefenseDescription>
          How different types affect{" "}
          <strong>
            {types.length > 0
              ? types
                  .map((t) => t.charAt(0).toUpperCase() + t.slice(1))
                  .join(" / ")
              : "this Pokémon"}
          </strong>
        </S.TypeDefenseDescription>

        {!hasAnyTypeDefenses ? (
          <S.EmptyState>All types deal neutral damage (1×)</S.EmptyState>
        ) : (
          <>
            {/* Weaknesses */}
            {groupedDefenses.weak.length > 0 && (
              <S.EffectivenessCategory>
                <S.CategoryLabel variant="weak">
                  <IconAlertTriangle size={16} />
                  Weak to (takes more damage)
                </S.CategoryLabel>
                <S.TypeDefenseGrid>
                  {groupedDefenses.weak.map(({ type, multiplier }) => (
                    <S.TypeChip key={type} type={type}>
                      <img
                        src={`/src/assets/type-icon/${type}.png`}
                        alt={type}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                      {type}
                      <span className="multiplier">
                        {formatMultiplier(multiplier)}
                      </span>
                    </S.TypeChip>
                  ))}
                </S.TypeDefenseGrid>
              </S.EffectivenessCategory>
            )}

            {/* Resistances */}
            {groupedDefenses.resistant.length > 0 && (
              <S.EffectivenessCategory>
                <S.CategoryLabel variant="resistant">
                  <IconShieldCheck size={16} />
                  Resistant to (takes less damage)
                </S.CategoryLabel>
                <S.TypeDefenseGrid>
                  {groupedDefenses.resistant.map(({ type, multiplier }) => (
                    <S.TypeChip key={type} type={type}>
                      <img
                        src={`/src/assets/type-icon/${type}.png`}
                        alt={type}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                      {type}
                      <span className="multiplier">
                        {formatMultiplier(multiplier)}
                      </span>
                    </S.TypeChip>
                  ))}
                </S.TypeDefenseGrid>
              </S.EffectivenessCategory>
            )}

            {/* Immunities */}
            {groupedDefenses.immune.length > 0 && (
              <S.EffectivenessCategory>
                <S.CategoryLabel variant="immune">
                  <IconShieldOff size={16} />
                  Immune to (no damage)
                </S.CategoryLabel>
                <S.TypeDefenseGrid>
                  {groupedDefenses.immune.map(({ type, multiplier }) => (
                    <S.TypeChip key={type} type={type}>
                      <img
                        src={`/src/assets/type-icon/${type}.png`}
                        alt={type}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                      {type}
                      <span className="multiplier">
                        {formatMultiplier(multiplier)}
                      </span>
                    </S.TypeChip>
                  ))}
                </S.TypeDefenseGrid>
              </S.EffectivenessCategory>
            )}
          </>
        )}
      </S.TypeDefenseContainer>

      {/* Move Pool Section */}
      <S.MovePoolContainer>
        <S.SectionHeader>
          <IconBolt size={22} />
          <h3>Move Pool</h3>
        </S.SectionHeader>

        {/* Damage Class Filter */}
        <S.FilterContainer>
          <S.FilterButton
            isActive={activeFilter === "all"}
            onClick={() => setActiveFilter("all")}
          >
            All Moves
          </S.FilterButton>
          <S.FilterButton
            isActive={activeFilter === "physical"}
            onClick={() => setActiveFilter("physical")}
          >
            <IconSword size={16} />
            Physical
          </S.FilterButton>
          <S.FilterButton
            isActive={activeFilter === "special"}
            onClick={() => setActiveFilter("special")}
          >
            <IconWand size={16} />
            Special
          </S.FilterButton>
          <S.FilterButton
            isActive={activeFilter === "status"}
            onClick={() => setActiveFilter("status")}
          >
            <IconRefresh size={16} />
            Status
          </S.FilterButton>
        </S.FilterContainer>

        {/* Move Categories */}
        {(
          ["levelUp", "machine", "egg", "tutor", "other"] as MoveCategory[]
        ).map(renderMoveCategory)}

        {/* Empty state if no moves match filter */}
        {Object.values(organizedMoves).every(
          (arr) => filterMoves(arr).length === 0,
        ) && (
          <S.EmptyState>
            No {activeFilter === "all" ? "moves" : `${activeFilter} moves`}{" "}
            found
          </S.EmptyState>
        )}
      </S.MovePoolContainer>
    </S.Container>
  );
};

export default MovesTab;
