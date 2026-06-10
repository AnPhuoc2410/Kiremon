import React from "react";
import { IconTrophy, IconCoin } from "@tabler/icons-react";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  rarity: string;
  rewardCoins?: number | null;
  icon: string;
  region?: string | null;
}

interface AchievementToastProps {
  t: {
    visible: boolean;
    id: string;
  };
  achievement: Achievement;
}

interface RarityStyle {
  border: string;
  bg: string;
  text: string;
  shadow: string;
  iconBg: string;
}

const RARITY_STYLES: Record<string, RarityStyle> = {
  gold: {
    border: "4px double #D4AF37",
    bg: "#FFFBEB",
    text: "#854D0E",
    shadow: "0 0 15px rgba(212, 175, 55, 0.4)",
    iconBg: "#FEF3C7",
  },
  silver: {
    border: "4px double #9CA3AF",
    bg: "#F9FAFB",
    text: "#374151",
    shadow: "0 0 15px rgba(156, 163, 175, 0.3)",
    iconBg: "#F3F4F6",
  },
  bronze: {
    border: "4px double #B45309",
    bg: "#FFFDF5",
    text: "#78350F",
    shadow: "0 0 15px rgba(180, 83, 9, 0.2)",
    iconBg: "#FEF3C7",
  },
};

const getBadgeUrl = (iconName: string): string | null => {
  if (iconName && iconName.startsWith("badge-")) {
    const num = parseInt(iconName.substring(6), 10);
    if (!isNaN(num)) {
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/badges/${num}.png`;
    }
  }
  return null;
};

export const AchievementToast: React.FC<AchievementToastProps> = ({
  t,
  achievement,
}) => {
  const style =
    RARITY_STYLES[(achievement.rarity || "").toLowerCase()] ||
    RARITY_STYLES.bronze;
  const badgeUrl = getBadgeUrl(achievement.icon || "");

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px 16px",
        background: style.bg,
        border: style.border,
        boxShadow: `0 8px 20px rgba(0,0,0,0.15), ${style.shadow}`,
        borderRadius: "4px",
        maxWidth: "320px",
        position: "relative",
        opacity: t.visible ? 1 : 0,
        transform: t.visible ? "scale(1)" : "scale(0.9)",
        transition: "all 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        fontFamily: "'VT323', monospace",
        imageRendering: "pixelated",
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          background: style.iconBg,
          border: "2px solid currentColor",
          color: style.text,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "4px",
          flexShrink: 0,
        }}
      >
        {badgeUrl ? (
          <img
            src={badgeUrl}
            alt={achievement.name}
            style={{
              width: "32px",
              height: "32px",
              imageRendering: "pixelated",
            }}
          />
        ) : (
          <IconTrophy size={24} />
        )}
      </div>
      <div style={{ flex: 1, color: "#111827" }}>
        <div
          style={{
            fontSize: "12px",
            fontWeight: "bold",
            textTransform: "uppercase",
            color: style.text,
            letterSpacing: "0.5px",
          }}
        >
          ! Achievement Unlocked !
        </div>
        <div
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            lineHeight: "1.1",
            marginTop: "2px",
          }}
        >
          {achievement.name}
        </div>
        <div
          style={{
            fontSize: "14px",
            color: "#4B5563",
            marginTop: "2px",
            lineHeight: "1.2",
          }}
        >
          {achievement.description}
        </div>
        {(achievement.rewardCoins ?? 0) > 0 && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "14px",
              fontWeight: "bold",
              color: "#D97706",
              marginTop: "4px",
            }}
          >
            <IconCoin size={14} fill="#F59E0B" color="#D97706" />+
            {achievement.rewardCoins} COINS
          </div>
        )}
      </div>
    </div>
  );
};
