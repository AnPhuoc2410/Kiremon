import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import * as T from "./index.style";
import BattleIntro from "@/pages/Battle/components/shared/BattleIntro";
import { usePokemonStore } from "@/store/app/pokemonStore";
import {
  LS_ENEMY_KEY,
  useSpawnEnemy,
} from "@/hooks/common/battle/useSpawnEnemy";
import { useSpawnGymLeader } from "@/hooks/common/battle/useSpawnGymLeader";
import { useBattleController } from "@/hooks/common/battle/useBattleController";
import { Text } from "@/components/ui";
import Gloves from "@/components/ui/Icon/Gloves";
import { POKEMON_TYPE_ICONS } from "@/utils/constant";

interface IVersusBattleModuleProps {
  pokemonNicknameParam?: string;
  leaderId?: string;
}

const LS_PLAYER_HP_KEY = "pokegames@battle-player-hp";

const VersusBattleModule = ({
  pokemonNicknameParam = "",
  leaderId = "",
}: IVersusBattleModuleProps) => {
  const navigate = useNavigate();
  const formattedNickname = pokemonNicknameParam
    ? pokemonNicknameParam.replace(/-/g, " ").toUpperCase()
    : "";
  const { pokemons } = usePokemonStore();
  const battleLogRef = useRef<HTMLDivElement>(null);

  // Load player pokemon as fallback/wild mode target
  const playerPokemon = formattedNickname
    ? pokemons.find((p: any) => p.nickname.toUpperCase() === formattedNickname)
    : undefined;

  // Spawners
  const {
    leader,
    activeEnemy: gymActiveEnemy,
    enemyRoster,
    activeEnemyIndex,
    updateRosterPokemon,
    sendNextPokemon: sendNextEnemy,
    clearGymBattle,
    isLoading: isLoadingGym,
  } = useSpawnGymLeader(leaderId);

  const {
    enemy: wildEnemy,
    isLoadingEnemy,
    updateEnemyState,
  } = useSpawnEnemy({
    userPokemon: {
      level: (playerPokemon as any)?.battle_state?.level || 1,
      experience: (playerPokemon as any)?.battle_state?.experience || 0,
    },
  });

  const enemy = leaderId ? gymActiveEnemy : wildEnemy;
  const isLoadingEnemyCombined = leaderId ? isLoadingGym : isLoadingEnemy;

  const { state, actions } = useBattleController({
    playerPokemon,
    enemy,
    updateEnemyState,
    key: { LS_PLAYER_HP_KEY, LS_ENEMY_KEY },
    leaderId,
    leader,
    activeEnemy: gymActiveEnemy,
    enemyRoster,
    activeEnemyIndex,
    updateRosterPokemon,
    sendNextEnemy,
    clearGymBattle,
  });

  useEffect(() => {
    const img = new Image();
    img.src = "/static/hit-effects.gif";
  }, []);

  useEffect(() => {
    if (battleLogRef.current) {
      battleLogRef.current.scrollTop = battleLogRef.current.scrollHeight;
    }
  }, [state.battleLog]);

  // Loading safety checks
  console.log("VersusBattleModule Render Debug:", {
    leaderId,
    pokemonNicknameParam,
    playerPokemon,
    gymActiveEnemy,
    enemyRoster,
    isLoadingGym,
    isLoadingEnemyCombined,
    enemy,
    activePlayer: state.currentPlayer,
    activeEnemy: state.currentEnemy,
    playerTeam: state.playerTeam,
  });

  if (leaderId && isLoadingGym) {
    return (
      <T.Container
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#60a5fa",
          fontSize: "1.5rem",
        }}
      >
        Loading Gym Battle...
      </T.Container>
    );
  }

  if (!leaderId && !playerPokemon) {
    return (
      <T.Container
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: "20px",
          color: "white",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: "2rem", color: "#ef4444" }}>
          No Pokémon Selected
        </h2>
        <p style={{ fontSize: "1.2rem", color: "#9ca3af" }}>
          You must select a Pokémon from your collection or configure your
          Combat Team to battle!
        </p>
        <button
          onClick={() => navigate("/profile")}
          style={{
            padding: "10px 20px",
            backgroundColor: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Back to Profile
        </button>
      </T.Container>
    );
  }

  if (isLoadingEnemyCombined && !enemy) {
    return (
      <T.Container
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#60a5fa",
          fontSize: "1.5rem",
        }}
      >
        Spawning Opponent...
      </T.Container>
    );
  }

  const activePlayer = state.currentPlayer;
  const activeEnemy = state.currentEnemy;

  if (!activePlayer || !activeEnemy) {
    return (
      <T.Container
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: "24px",
          color: "white",
          padding: "40px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "2.5rem",
            color: "#ef4444",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          Battle Preparation Failed
        </h2>
        <p
          style={{
            fontSize: "1.2rem",
            color: "#d1d5db",
            maxWidth: "600px",
            lineHeight: "1.6",
          }}
        >
          {!activePlayer
            ? "Your Active Party is empty! You need to select at least one Pokémon for your Party in the PC Storage before challenging Gym Leaders."
            : "Could not retrieve the opponent Pokémon details."}
        </p>
        {!activePlayer && (
          <button
            onClick={() => navigate("/my-pokemon/pc")}
            style={{
              padding: "14px 28px",
              backgroundColor: "#ef4444",
              color: "white",
              border: "4px solid #fff",
              boxShadow: "0 0 10px rgba(239, 68, 68, 0.5)",
              fontSize: "1.1rem",
              fontWeight: "bold",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "transform 0.2s",
            }}
          >
            Go to PC Storage (Party)
          </button>
        )}
        <button
          onClick={() => navigate("/profile")}
          style={{
            padding: "10px 20px",
            backgroundColor: "#4b5563",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
          Back to Profile
        </button>
      </T.Container>
    );
  }

  const maxPlayerHP = activePlayer.stats?.hp || 100;
  const maxEnemyHP = activeEnemy.stats?.hp || 100;
  const playerHPPercentage = (state.playerCurrentHP / maxPlayerHP) * 100;
  const enemyHPPercentage = (state.enemyCurrentHP / maxEnemyHP) * 100;
  const playerDisplaySprite = activePlayer.sprite_back || activePlayer.sprite;

  const isInputLocked = !state.isPlayerTurn || state.isProcessingTurn;

  const renderTeamStatus = (team: any[], currentIdx: number, hps: number[]) => {
    return (
      <div style={{ display: "flex", gap: "6px", margin: "4px 0" }}>
        {team.map((p, idx) => {
          const hp = hps[idx] !== undefined ? hps[idx] : p.stats?.hp || 50;
          const isFainted = hp <= 0;
          const isActive = idx === currentIdx;
          return (
            <div
              key={idx}
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: isFainted
                  ? "#4b5563" // dark grey (fainted)
                  : isActive
                    ? "#ef4444" // red (active)
                    : "#10b981", // green (alive)
                border: "2px solid #000",
                boxShadow: isActive ? "0 0 4px #fbbf24" : "none",
              }}
              title={`${p.name || p.nickname} (HP: ${hp})`}
            />
          );
        })}
      </div>
    );
  };

  return (
    <T.Container>
      <AnimatePresence>
        {state.showIntro && (
          <BattleIntro
            player={activePlayer}
            enemy={activeEnemy}
            leader={leader}
            onComplete={() => actions.setShowIntro(false)}
          />
        )}
      </AnimatePresence>

      <T.BattleWrapper>
        <T.BattleField>
          {/* --- ENEMY SECTION --- */}
          <T.EnemySection>
            <T.EnemyInfo>
              <T.InfoBox>
                {leader && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "6px",
                      borderBottom: "1px solid #ddd",
                      paddingBottom: "4px",
                    }}
                  >
                    <img
                      src={leader.avatar}
                      alt={leader.name}
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        border: "2px solid #ef4444",
                        backgroundColor: "#fff",
                      }}
                    />
                    <div>
                      <div
                        style={{
                          fontSize: "0.9rem",
                          fontWeight: "bold",
                          color: "#dc2626",
                        }}
                      >
                        Gym Leader {leader.name}
                      </div>
                      <div style={{ fontSize: "0.7rem", color: "#4b5563" }}>
                        {leader.badgeName}
                      </div>
                    </div>
                  </div>
                )}
                <T.CharacterName>{activeEnemy.name}</T.CharacterName>
                {leaderId &&
                  renderTeamStatus(
                    enemyRoster,
                    activeEnemyIndex,
                    enemyRoster.map((p) => p.current_hp ?? p.stats.hp),
                  )}
                <T.HPBarContainer>
                  <T.HPBar width={enemyHPPercentage} color="#ef4444" />
                </T.HPBarContainer>
                <T.HPText>
                  {state.enemyCurrentHP}/{maxEnemyHP} HP
                </T.HPText>
                <T.HPText>Lvl. {activeEnemy.battle_state?.level}</T.HPText>
              </T.InfoBox>
            </T.EnemyInfo>

            <T.EnemySpriteWrapper>
              {state.activeHitTarget === "enemy" && (
                <T.HitEffectImage
                  key={`hit-enemy-${state.hitKey}`}
                  src="/static/hit-effects.gif"
                  alt="hit"
                />
              )}

              {/* --- ENEMY DAMAGE TEXT --- */}
              <AnimatePresence>
                {state.damages
                  .filter((d) => d.target === "enemy")
                  .map((damage) => (
                    <T.DamageWrapper key={damage.id}>
                      <motion.div
                        initial={{
                          opacity: 0,
                          y: 0,
                          scale: damage.isCritical ? 0.5 : 0.8,
                        }}
                        animate={{
                          opacity: [0, 1, 1],
                          y: -60,
                          scale: damage.isCritical ? [1, 1.5, 1.2] : 1,
                          x: damage.isCritical ? [0, -5, 5, -5, 5, 0] : 0,
                        }}
                        exit={{ opacity: 0, y: -80 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      >
                        <T.DamageText
                          isCritical={damage.isCritical}
                          effectiveness={damage.effectiveness}
                        >
                          {damage.value === 0 ? "Miss" : damage.value}
                          {damage.isCritical && "!"}

                          {damage.effectiveness >= 2 && !damage.isCritical && (
                            <span style={{ fontSize: "0.5em", marginLeft: 4 }}>
                              {`(${damage.effectiveness}x)`}
                            </span>
                          )}
                        </T.DamageText>
                      </motion.div>
                    </T.DamageWrapper>
                  ))}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {state.enemyCurrentHP > 0 && (
                  <motion.div
                    key={activeEnemy.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "flex-end",
                    }}
                  >
                    <T.PokemonSprite
                      src={activeEnemy.sprite}
                      alt="Enemy"
                      style={{ transform: "scaleX(1)" }}
                    />
                    <T.ShadowEnemy />
                  </motion.div>
                )}
              </AnimatePresence>
            </T.EnemySpriteWrapper>
          </T.EnemySection>

          {/* --- PLAYER SECTION --- */}
          <T.PlayerSection>
            <T.PlayerSpriteWrapper>
              {state.activeHitTarget === "player" && (
                <T.HitEffectImage
                  key={`hit-player-${state.hitKey}`}
                  src="/static/hit-effects.gif"
                  alt="hit"
                />
              )}

              {/* --- PLAYER DAMAGE TEXT --- */}
              <AnimatePresence>
                {state.damages
                  .filter((d) => d.target === "player")
                  .map((damage) => (
                    <T.DamageWrapper key={damage.id}>
                      <motion.div
                        initial={{
                          opacity: 0,
                          y: 0,
                          scale: damage.isCritical ? 0.5 : 0.8,
                        }}
                        animate={{
                          opacity: [0, 1, 1],
                          y: -60,
                          scale: damage.isCritical ? [1, 1.5, 1.2] : 1,
                          x: damage.isCritical ? [0, -5, 5, -5, 5, 0] : 0,
                        }}
                        exit={{ opacity: 0, y: -80 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      >
                        <T.DamageText
                          isCritical={damage.isCritical}
                          effectiveness={damage.effectiveness}
                        >
                          {damage.value === 0 ? "Miss" : damage.value}
                          {damage.isCritical && "!"}
                        </T.DamageText>
                      </motion.div>
                    </T.DamageWrapper>
                  ))}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {state.playerCurrentHP > 0 && (
                  <motion.div
                    key={activePlayer.nickname}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "flex-end",
                    }}
                  >
                    <T.PokemonSprite
                      src={playerDisplaySprite}
                      alt="Player"
                      style={{ transform: "scaleX(1)" }}
                    />
                    <T.Shadow />
                  </motion.div>
                )}
              </AnimatePresence>
            </T.PlayerSpriteWrapper>

            <T.PlayerInfo>
              <T.PlayerInfoBox>
                <T.CharacterName>{activePlayer.nickname}</T.CharacterName>
                {state.playerTeam.length > 1 &&
                  renderTeamStatus(
                    state.playerTeam,
                    state.activePlayerIdx,
                    state.playerTeamHps,
                  )}
                <T.HPBarContainer>
                  <T.HPBar width={playerHPPercentage} color="#10b981" />
                </T.HPBarContainer>
                <T.HPText>
                  {state.playerCurrentHP}/{maxPlayerHP} HP
                </T.HPText>
                <T.HPText>Lvl. {activePlayer.battle_state?.level}</T.HPText>
              </T.PlayerInfoBox>
            </T.PlayerInfo>
          </T.PlayerSection>

          {/* --- INTERFACE --- */}
          <T.InterfaceWrapper>
            <T.BattleLog ref={battleLogRef}>
              <T.LogTitle>Battle Log</T.LogTitle>
              {state.battleLog.map((log, idx) => (
                <T.LogEntry
                  key={idx}
                  style={{
                    color: log.includes(">>>") ? "#fbbf24" : "inherit",
                    fontWeight: log.includes(">>>") ? "bold" : "normal",
                    textShadow: log.includes(">>>") ? "1px 1px 0 #000" : "none",
                  }}
                >
                  &gt; {log}
                </T.LogEntry>
              ))}
            </T.BattleLog>

            <T.BattleMenu>
              <T.MenuTitle>
                {state.gameOver
                  ? "Game Over"
                  : state.isPlayerTurn
                    ? `What will ${activePlayer.nickname} do?`
                    : `${activeEnemy.name} is attacking...`}
              </T.MenuTitle>

              {!state.gameOver ? (
                <T.AttackGrid>
                  {/* --- ULTIMATE GAUGE BAR --- */}
                  <div
                    style={{
                      gridColumn: "span 2",
                      marginBottom: "0.25rem",
                      marginTop: "-0.25rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "0.75rem",
                        marginBottom: "0.1rem",
                        fontWeight: "bold",
                        color: "#374151",
                      }}
                    >
                      <span>Ultimate Charge</span>
                      <span>{state.ultimateGauge}%</span>
                    </div>

                    <div
                      style={{
                        width: "100%",
                        height: "0.6rem",
                        backgroundColor: "#d1d5db",
                        borderRadius: "999px",
                        overflow: "hidden",
                        border: "1px solid #9ca3af",
                      }}
                    >
                      <div
                        style={{
                          width: `${state.ultimateGauge}%`,
                          height: "100%",
                          backgroundColor:
                            state.ultimateGauge >= 100 ? "#fbbf24" : "#3b82f6",
                          transition: "width 0.3s ease-out",
                        }}
                      />
                    </div>
                  </div>

                  {/* --- ULTIMATE MOVES --- */}
                  {activePlayer.moves?.map((move: any, idx: number) => {
                    const isUltimateReady =
                      !isInputLocked && state.ultimateGauge >= 100;

                    return (
                      <T.StyledButton
                        key={idx}
                        type="button"
                        style={{
                          fontSize: "1rem",
                          gap: "0.5rem",
                          opacity: isUltimateReady ? 1 : 0.6,
                          filter: isUltimateReady ? "none" : "grayscale(100%)",
                          cursor: isUltimateReady ? "pointer" : "not-allowed",
                        }}
                        onClick={() =>
                          actions.useUltimate(
                            move.name,
                            move.power || 50,
                            move.type || "normal",
                          )
                        }
                        pokemonType={move.type || "normal"}
                        disabled={!isUltimateReady}
                      >
                        {POKEMON_TYPE_ICONS[move.type || "normal"] && (
                          <img
                            alt={move.type || "normal"}
                            src={POKEMON_TYPE_ICONS[move.type || "normal"]}
                            width={24}
                            height={24}
                            loading="lazy"
                          />
                        )}
                        <Text as="span" variant="outlined">
                          {move.name}
                        </Text>
                      </T.StyledButton>
                    );
                  })}

                  {/* --- BASIC ATTACK (CHARGER) --- */}
                  <T.BasicAttackButton
                    type="button"
                    style={{ gridColumn: "span 2 / span 2" }}
                    disabled={isInputLocked}
                    onClick={actions.basicAttack}
                  >
                    <Text
                      variant="outlined"
                      size="lg"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <span
                        style={{
                          position: "relative",
                          width: "1.75rem",
                          height: "1.5rem",
                          flexShrink: 0,
                        }}
                      >
                        <Gloves
                          style={{
                            width: "1.5rem",
                            height: "1.5rem",
                            position: "absolute",
                            left: 0,
                            top: 0,
                            zIndex: 2,
                          }}
                        />
                        <Gloves
                          style={{
                            width: "1.5rem",
                            height: "1.5rem",
                            position: "absolute",
                            left: "0.15rem",
                            top: 0,
                          }}
                          color="#000"
                        />
                      </span>
                      <span>Basic Attack (Charge)</span>
                    </Text>
                  </T.BasicAttackButton>

                  {(!activePlayer.moves || activePlayer.moves.length === 0) && (
                    <T.StyledButton
                      type="button"
                      onClick={actions.useStruggle}
                      disabled={isInputLocked}
                    >
                      Struggle
                    </T.StyledButton>
                  )}
                </T.AttackGrid>
              ) : (
                <>
                  {state.playerCurrentHP <= 0 ? (
                    <T.ResetButton
                      type="button"
                      onClick={actions.runAway}
                      style={{ backgroundColor: "#ef4444" }}
                    >
                      <Text variant="outlined">Back to Profile</Text>
                    </T.ResetButton>
                  ) : (
                    <T.ResetButton type="button" onClick={actions.runAway}>
                      <Text as="span" variant="outlined">
                        Back to Profile
                      </Text>
                    </T.ResetButton>
                  )}
                </>
              )}
            </T.BattleMenu>

            <div style={{ paddingTop: "0.5rem", borderTop: "1px solid #ccc" }}>
              {!state.gameOver && (
                <T.ResetButton
                  onClick={actions.surrender}
                  style={{ backgroundColor: "#ef4444", marginTop: 16 }}
                >
                  <Text variant="outlined">Surrender (Back to Profile)</Text>
                </T.ResetButton>
              )}
            </div>
          </T.InterfaceWrapper>
        </T.BattleField>
      </T.BattleWrapper>
    </T.Container>
  );
};

export default VersusBattleModule;
