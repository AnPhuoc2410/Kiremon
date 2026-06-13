import { useEffect } from "react";
import { clearTimeout, setTimeout } from "worker-timers";
import {
  IntroOverlay,
  VsBadge,
  VsContainer,
  VsImage,
  VsName,
  VsSide,
} from "./index.style";
import { IPokemon } from "@/types/pokemon";
import { TypeCard } from "@/components/ui";
import { useAuth } from "@/contexts/AuthContext";

interface IBattleIntroProps {
  player: IPokemon | undefined;
  enemy: IPokemon | null;
  leader?: any;
  onComplete: () => void;
}

const BattleIntro = ({
  player,
  enemy,
  leader,
  onComplete,
}: IBattleIntroProps) => {
  const { user } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  // Determine display details for player side
  const playerDisplayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`.toUpperCase()
      : (user?.username ?? "TRAINER").toUpperCase();
  const playerAvatar =
    user?.avatarUrl ??
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png";

  // Determine display name and sprite for enemy side
  const displayName = leader
    ? `GYM LEADER ${leader.name.toUpperCase()}`
    : enemy?.name || "ENEMY";
  const displaySprite = leader ? leader.sprite : enemy?.sprite;

  return (
    <IntroOverlay
      initial={{ clipPath: "circle(150% at 50% 50%)" }}
      exit={{
        clipPath: "circle(0% at 50% 50%)",
        transition: {
          duration: 1.2,
          ease: "linear",
        },
      }}
    >
      <VsContainer>
        {/* PLAYER SIDE (Left) */}
        <VsSide
          align="left"
          color="rgba(16, 185, 129, 0.2)"
          initial={{ x: "-100%" }}
          animate={{ x: "0%" }}
          transition={{ type: "spring", stiffness: 50, damping: 15 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
            <span
              style={{
                color: "#fbbf24",
                fontWeight: "bold",
                textShadow: "1px 1px 0 #000",
              }}
            >
              TRAINER
            </span>
          </div>
          <VsName>{playerDisplayName}</VsName>
          <VsImage
            src={playerAvatar}
            alt={playerDisplayName}
            style={{
              borderRadius: user?.avatarUrl ? "50%" : "0px",
              border: user?.avatarUrl ? "4px solid #fff" : "none",
              boxShadow: user?.avatarUrl ? "0 0 10px rgba(0,0,0,0.3)" : "none",
              backgroundColor: user?.avatarUrl
                ? "rgba(255,255,255,0.8)"
                : "transparent",
              width: "240px",
              height: "240px",
              objectFit: "contain",
            }}
          />
        </VsSide>

        {/* ENEMY SIDE (Right) */}
        <VsSide
          align="right"
          color="rgba(239, 68, 68, 0.2)"
          initial={{ x: "100%" }}
          animate={{ x: "0%" }}
          transition={{ type: "spring", stiffness: 50, damping: 15 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
            {!leader &&
              enemy?.types?.map((type) => <TypeCard key={type} type={type} />)}
            {leader && (
              <span
                style={{
                  color: "#fbbf24",
                  fontWeight: "bold",
                  textShadow: "1px 1px 0 #000",
                }}
              >
                {leader.region} Gym Leader
              </span>
            )}
          </div>
          <VsName>{displayName}</VsName>
          <VsImage src={displaySprite} alt="Enemy" />
        </VsSide>

        {/* VS TEXT - Zoom In Effect */}
        <VsBadge
          initial={{ scale: 0, opacity: 0, x: "-50%", y: "-50%" }}
          animate={{ scale: 1, opacity: 1, x: "-50%", y: "-50%" }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        >
          VS
        </VsBadge>
      </VsContainer>
    </IntroOverlay>
  );
};

export default BattleIntro;
