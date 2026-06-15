import { useEffect, useRef, useState } from "react";
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
import { getGymLeaderDefeatQuote } from "@/hooks/common/battle/battleHelpers";
import { Text } from "@/components/ui";
import Gloves from "@/components/ui/Icon/Gloves";
import { POKEMON_TYPE_ICONS } from "@/utils/constant";

interface IVersusBattleModuleProps {
  pokemonNicknameParam?: string;
  leaderId?: string;
}

const LS_PLAYER_HP_KEY = "pokegames@battle-player-hp";

const TypewriterText = ({ text }: { text: string }) => {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    setDisplayed("");
    if (!text) return;

    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, 25);

    return () => clearInterval(id);
  }, [text]);

  const done = displayed.length >= text.length;

  return (
    <>
      {displayed}
      {!done && (
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ repeat: Infinity, duration: 0.55 }}
          style={{ marginLeft: 2 }}
        >
          ▌
        </motion.span>
      )}
    </>
  );
};

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

  // Play battle theme music (looping) on mount
  useEffect(() => {
    const audio = new Audio(
      "https://play.pokemonshowdown.com/audio/bw2-kanto-gym-leader.ogg",
    );
    audio.loop = true;
    audio.volume = 0.35; // Comfortable volume level

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn(
          "Audio playback blocked by browser autocomplete/interaction policy:",
          err,
        );
      });
    }

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  const [introPhase, setIntroPhase] = useState<number | "complete">(() => {
    return state.showIntro ? 0 : "complete";
  });

  useEffect(() => {
    if (!state.showIntro && introPhase === 0) {
      setIntroPhase(1);
    }
  }, [state.showIntro, introPhase]);

  useEffect(() => {
    if (introPhase === "complete" || introPhase === 0) return;

    let timer: number;
    if (introPhase === 1) {
      timer = window.setTimeout(() => {
        if (leaderId) {
          setIntroPhase(2);
        } else {
          setIntroPhase(3);
        }
      }, 2800);
    } else if (introPhase === 2) {
      timer = window.setTimeout(() => {
        setIntroPhase(3);
      }, 1500);
    } else if (introPhase === 3) {
      timer = window.setTimeout(() => {
        setIntroPhase(4);
      }, 1500);
    } else if (introPhase === 4) {
      timer = window.setTimeout(() => {
        setIntroPhase("complete");
      }, 1500);
    }

    return () => window.clearTimeout(timer);
  }, [introPhase, leaderId]);

  const getDialogText = () => {
    if (introPhase === 1 || introPhase === 2) {
      if (leaderId && leader) {
        return `Gym Leader ${leader.name} wants to battle!`;
      }
      return `A wild ${state.currentEnemy?.name || "Pokémon"} appeared!`;
    }
    if (introPhase === 3 || introPhase === 4) {
      const p = state.currentPlayer;
      return `Go! ${p?.nickname || p?.name || "Pokémon"}!`;
    }
    return "";
  };

  const dialogText = getDialogText();

  useEffect(() => {
    const img = new Image();
    img.src = "/static/hit-effects.gif";
  }, []);

  useEffect(() => {
    if (battleLogRef.current) {
      battleLogRef.current.scrollTop = battleLogRef.current.scrollHeight;
    }
  }, [state.battleLog]);

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
      <style>{`
        @keyframes ash-throw-ball {
          0% { background-position: 0px 0px; }
          100% { background-position: -512px 0px; }
        }
      `}</style>
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
            <AnimatePresence>
              {!state.gameOver && introPhase === "complete" && (
                <motion.div
                  initial={{ x: 200, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 200, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 80, damping: 15 }}
                >
                  <T.EnemyInfo>
                    <T.InfoBox>
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
                      <T.HPText>
                        Lvl.{" "}
                        {activeEnemy.level ??
                          activeEnemy.battle_state?.level ??
                          5}
                      </T.HPText>
                    </T.InfoBox>
                  </T.EnemyInfo>
                </motion.div>
              )}
            </AnimatePresence>

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

              {/* Gym Leader Trainer Sprite during intro */}
              {leaderId && (introPhase === 1 || introPhase === 2) && leader && (
                <motion.div
                  key="intro-gym-leader"
                  initial={{ x: 200, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 200, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 50, damping: 14 }}
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    top: 0,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-end",
                    zIndex: 15,
                  }}
                >
                  <img
                    src={leader.sprite}
                    alt={leader.name}
                    style={{
                      height: "140px",
                      width: "auto",
                      objectFit: "contain",
                      imageRendering: "pixelated",
                      transform: "scale(1.7)",
                      transformOrigin: "bottom center",
                    }}
                  />
                  <T.ShadowEnemy />
                </motion.div>
              )}

              {/* Gym Leader Pokéball throw during intro */}
              {leaderId && introPhase === 2 && (
                <motion.img
                  key="leader-pokeball"
                  src="/static/pokeball.png"
                  alt="Pokeball"
                  initial={{ x: 40, y: -20, rotate: 0, scale: 0.8, opacity: 1 }}
                  animate={{
                    x: [-40, -100, -120],
                    y: [-40, -80, 0],
                    rotate: [0, -360, -720],
                    scale: [0.8, 1, 0.5],
                    opacity: [1, 1, 0],
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  style={{
                    position: "absolute",
                    width: "24px",
                    height: "24px",
                    bottom: "50px",
                    left: "50%",
                    zIndex: 20,
                    imageRendering: "pixelated",
                  }}
                />
              )}

              <AnimatePresence mode="wait">
                {state.enemyCurrentHP > 0 &&
                  !(state.gameOver && state.playerCurrentHP <= 0) &&
                  (introPhase === "complete" ||
                    (!leaderId && introPhase >= 1) ||
                    (leaderId && introPhase >= 3)) && (
                    <motion.div
                      key={activeEnemy.name}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 150,
                        damping: 12,
                      }}
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
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (!target.dataset.fallback) {
                            target.dataset.fallback = "1";
                            // Fall back to static PokeAPI sprite using activeEnemy numeric id
                            target.src =
                              activeEnemy.sprite
                                ?.replace("/animated/", "/")
                                .replace(".gif", ".png") || "";
                          }
                        }}
                      />
                      <T.ShadowEnemy />
                    </motion.div>
                  )}

                {state.gameOver && state.playerCurrentHP <= 0 && leader && (
                  <>
                    {/* Gym Leader Speech Bubble */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5, y: 30 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{
                        delay: 0.6,
                        type: "spring",
                        stiffness: 90,
                        damping: 14,
                      }}
                      style={{
                        position: "absolute",
                        bottom: "195px",
                        left: "-60px",
                        transform: "translateX(-50%)",
                        backgroundColor: "#ffffff",
                        color: "#1f2937",
                        padding: "10px 14px",
                        borderRadius: "12px",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.35)",
                        width: "240px",
                        fontSize: "0.95rem",
                        fontWeight: "bold",
                        lineHeight: "1.4",
                        border: "3px solid #000000",
                        zIndex: 35,
                        textAlign: "center",
                      }}
                    >
                      {/* Bubble Triangle Arrow pointing down */}
                      <div
                        style={{
                          position: "absolute",
                          bottom: "-12px",
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: 0,
                          height: 0,
                          borderLeft: "8px solid transparent",
                          borderRight: "8px solid transparent",
                          borderTop: "12px solid #000000",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          bottom: "-8px",
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: 0,
                          height: 0,
                          borderLeft: "7px solid transparent",
                          borderRight: "7px solid transparent",
                          borderTop: "10px solid #ffffff",
                        }}
                      />
                      {getGymLeaderDefeatQuote(leader.name)}
                    </motion.div>

                    {/* Animated, scaled Gym Leader sprite */}
                    <motion.div
                      key={leader.name}
                      initial={{ opacity: 0, scale: 0.3, y: 80, x: 50 }}
                      animate={{ opacity: 1, scale: 2.2, y: -20, x: -60 }}
                      exit={{ opacity: 0, scale: 0.3, y: 80, x: 50 }}
                      transition={{
                        type: "spring",
                        stiffness: 70,
                        damping: 12,
                      }}
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "flex-end",
                        position: "relative",
                        zIndex: 25,
                      }}
                    >
                      <T.PokemonSprite
                        src={leader.sprite}
                        alt={leader.name}
                        style={{
                          height: "120px",
                          width: "auto",
                          objectFit: "contain",
                        }}
                      />
                    </motion.div>
                  </>
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

              {/* Player Trainer Sprite during intro */}
              {(introPhase === 1 || introPhase === 2 || introPhase === 3) && (
                <motion.div
                  key="intro-player-trainer"
                  initial={{ x: -200, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -200, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 50, damping: 14 }}
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    top: 0,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-end",
                    zIndex: 15,
                  }}
                >
                  {introPhase === 3 ? (
                    <div
                      style={{
                        width: "128px",
                        height: "128px",
                        backgroundImage: "url('/trainer/ash_xuatchieu.png')",
                        backgroundSize: "640px 128px",
                        backgroundRepeat: "no-repeat",
                        imageRendering: "pixelated",
                        transform: "scale(1.8)",
                        transformOrigin: "bottom center",
                        animation: "ash-throw-ball 0.7s steps(4) forwards",
                      }}
                    />
                  ) : (
                    <img
                      src="/trainer/ash_back_sprited.png"
                      alt="Player Trainer"
                      style={{
                        height: "128px",
                        width: "auto",
                        objectFit: "contain",
                        imageRendering: "pixelated",
                        transform: "scale(1.8)",
                        transformOrigin: "bottom center",
                      }}
                    />
                  )}
                  <T.Shadow />
                </motion.div>
              )}

              {/* Player Pokéball throw during intro */}
              {introPhase === 3 && (
                <motion.img
                  key="player-pokeball"
                  src="/static/pokeball.png"
                  alt="Pokeball"
                  initial={{
                    x: -40,
                    y: -20,
                    rotate: 0,
                    scale: 0.8,
                    opacity: 0,
                  }}
                  animate={{
                    x: [-40, 40, 100, 120],
                    y: [-20, -80, -40, 0],
                    rotate: [0, 180, 360, 540],
                    scale: [0.8, 1, 0.8, 0.5],
                    opacity: [0, 1, 1, 0],
                  }}
                  transition={{ delay: 0.38, duration: 0.62, ease: "easeOut" }}
                  style={{
                    position: "absolute",
                    width: "24px",
                    height: "24px",
                    bottom: "50px",
                    left: "50%",
                    zIndex: 20,
                    imageRendering: "pixelated",
                  }}
                />
              )}

              <AnimatePresence mode="wait">
                {state.playerCurrentHP > 0 &&
                  (introPhase === "complete" || introPhase >= 4) && (
                    <motion.div
                      key={activePlayer.nickname}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 150,
                        damping: 12,
                      }}
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
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (!target.dataset.fallback) {
                            target.dataset.fallback = "1";
                            // Fall back to static back sprite URL
                            target.src =
                              activePlayer.sprite_back
                                ?.replace("/animated/", "/")
                                .replace(".gif", ".png") ||
                              activePlayer.sprite ||
                              "";
                          }
                        }}
                      />
                      <T.Shadow />
                    </motion.div>
                  )}
              </AnimatePresence>
            </T.PlayerSpriteWrapper>

            <AnimatePresence>
              {!state.gameOver &&
                state.playerCurrentHP > 0 &&
                introPhase === "complete" && (
                  <motion.div
                    initial={{ x: -200, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -200, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 80, damping: 15 }}
                  >
                    <T.PlayerInfo>
                      <T.PlayerInfoBox>
                        <T.CharacterName>
                          {activePlayer.nickname}
                        </T.CharacterName>
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
                        <T.HPText>
                          Lvl.{" "}
                          {activePlayer.level ??
                            activePlayer.battle_state?.level ??
                            1}
                        </T.HPText>
                      </T.PlayerInfoBox>
                    </T.PlayerInfo>
                  </motion.div>
                )}
            </AnimatePresence>
          </T.PlayerSection>

          {/* --- INTERFACE --- */}
          <T.InterfaceWrapper>
            <AnimatePresence mode="wait">
              {introPhase !== "complete" ? (
                <motion.div
                  key="intro-dialog-box"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  transition={{ type: "spring", stiffness: 80, damping: 15 }}
                  style={{
                    width: "100%",
                    backgroundColor: "#fff",
                    border: "4px solid #1f2937",
                    boxShadow: "6px 6px 0px #1f2937",
                    padding: "20px 24px",
                    fontFamily: "'VT323', Courier, monospace",
                    imageRendering: "pixelated",
                    minHeight: "140px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: "1.6rem",
                      color: "#1f2937",
                      lineHeight: "1.4",
                    }}
                  >
                    <TypewriterText text={dialogText} />
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  key="battle-controls"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "15px",
                    width: "100%",
                  }}
                >
                  <T.BattleLog ref={battleLogRef}>
                    <T.LogTitle>Battle Log</T.LogTitle>
                    {state.battleLog.map((log, idx) => (
                      <T.LogEntry
                        key={idx}
                        style={{
                          color: log.includes(">>>") ? "#fbbf24" : "inherit",
                          fontWeight: log.includes(">>>") ? "bold" : "normal",
                          textShadow: log.includes(">>>")
                            ? "1px 1px 0 #000"
                            : "none",
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
                                  state.ultimateGauge >= 100
                                    ? "#fbbf24"
                                    : "#3b82f6",
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
                                filter: isUltimateReady
                                  ? "none"
                                  : "grayscale(100%)",
                                cursor: isUltimateReady
                                  ? "pointer"
                                  : "not-allowed",
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
                                  src={
                                    POKEMON_TYPE_ICONS[move.type || "normal"]
                                  }
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

                        {(!activePlayer.moves ||
                          activePlayer.moves.length === 0) && (
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
                          <T.ResetButton
                            type="button"
                            onClick={actions.runAway}
                          >
                            <Text as="span" variant="outlined">
                              Back to Profile
                            </Text>
                          </T.ResetButton>
                        )}
                      </>
                    )}
                  </T.BattleMenu>

                  <div
                    style={{
                      paddingTop: "0.5rem",
                      borderTop: "1px solid #ccc",
                    }}
                  >
                    {!state.gameOver && (
                      <T.ResetButton
                        onClick={actions.surrender}
                        style={{ backgroundColor: "#ef4444", marginTop: 16 }}
                      >
                        <Text variant="outlined">
                          Surrender (Back to Profile)
                        </Text>
                      </T.ResetButton>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </T.InterfaceWrapper>
        </T.BattleField>
      </T.BattleWrapper>
    </T.Container>
  );
};

export default VersusBattleModule;
