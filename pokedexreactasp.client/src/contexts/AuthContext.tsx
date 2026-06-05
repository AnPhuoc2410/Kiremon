import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLoginData, AuthUser } from "@/types/auth.types";
import {
  eraseCookie,
  getCookie,
  setCookie,
} from "@/components/utils/cookieUtils";
import toast from "react-hot-toast";
import { presenceHub } from "@/services/signalr/presence.hub";
import { IconTrophy, IconCoin } from "@tabler/icons-react";

interface AuthContextType {
  isAuthenticated: boolean;
  isInitialized: boolean;
  authData: AuthLoginData | null;
  user: AuthUser | null;
  authLogin: (data: AuthLoginData) => void;
  authLogout: () => void;
  updateUser: (updates: Partial<AuthUser>) => void;
  getToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AchievementToast = ({ t, achievement }: { t: any; achievement: any }) => {
  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case "gold":
        return {
          border: "4px double #D4AF37",
          bg: "#FFFBEB",
          text: "#854D0E",
          shadow: "0 0 15px rgba(212, 175, 55, 0.4)",
          iconBg: "#FEF3C7",
        };
      case "silver":
        return {
          border: "4px double #9CA3AF",
          bg: "#F9FAFB",
          text: "#374151",
          shadow: "0 0 15px rgba(156, 163, 175, 0.3)",
          iconBg: "#F3F4F6",
        };
      case "bronze":
      default:
        return {
          border: "4px double #B45309",
          bg: "#FFFDF5",
          text: "#78350F",
          shadow: "0 0 15px rgba(180, 83, 9, 0.2)",
          iconBg: "#FEF3C7",
        };
    }
  };

  const style = getRarityColor(achievement.rarity || "bronze");

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
        <IconTrophy size={24} />
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
        {achievement.rewardCoins > 0 && (
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [authData, setAuthData] = useState<AuthLoginData | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const navigate = useNavigate();

  // Check token expiration
  const checkTokenExpiration = () => {
    const expiresTimestamp = getCookie("expires");
    if (expiresTimestamp) {
      const expiresDate = new Date(expiresTimestamp);
      const currentDate = new Date();

      if (currentDate > expiresDate) {
        console.log("Token expired, logging out");
        authLogout();
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = getCookie("accessToken");
        const expiresTimestamp = getCookie("expires");
        const storedUser = getCookie("authUser");

        if (token && expiresTimestamp) {
          // Check if token is expired before proceeding
          if (!checkTokenExpiration()) {
            setIsInitialized(true);
            return;
          }

          // Restore user from cookie
          let parsedUser: AuthUser | null = null;
          if (storedUser) {
            try {
              parsedUser = JSON.parse(decodeURIComponent(storedUser));
            } catch {
              console.warn("Failed to parse stored user");
            }
          }

          setIsAuthenticated(true);
          setUser(parsedUser);
          setAuthData({
            accessToken: token,
            expires: expiresTimestamp,
            user: parsedUser!,
          });
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();

    // Set up interval to check token expiration regularly
    const expirationCheckInterval = setInterval(() => {
      if (isAuthenticated) {
        checkTokenExpiration();
      }
    }, 60000); // Check every minute

    return () => {
      clearInterval(expirationCheckInterval);
    };
  }, [isAuthenticated]);

  // Global PresenceHub & Real-time Achievement Notifications
  useEffect(() => {
    if (isAuthenticated) {
      presenceHub.start();

      const unsubscribe = presenceHub.onAchievementUnlocked((achievement) => {
        toast.custom(
          (t) => <AchievementToast t={t} achievement={achievement} />,
          {
            position: "top-right",
            duration: 5000,
          },
        );
      });

      return () => {
        unsubscribe();
        presenceHub.stop();
      };
    }
  }, [isAuthenticated]);

  const authLogin = async (loginData: AuthLoginData): Promise<void> => {
    if (!loginData?.accessToken || !loginData?.user) {
      console.error("Invalid login data");
      return;
    }

    setIsAuthenticated(true);
    setAuthData(loginData);
    setUser(loginData.user);

    setCookie("accessToken", loginData.accessToken, 7);
    setCookie("expires", loginData.expires, 7);
    setCookie(
      "authUser",
      encodeURIComponent(JSON.stringify(loginData.user)),
      7,
    );
  };

  const authLogout = () => {
    setIsAuthenticated(false);
    setAuthData(null);
    setUser(null);

    eraseCookie("accessToken");
    eraseCookie("expires");
    eraseCookie("authUser");

    toast.success("Đăng xuất thành công", { duration: 2500 });
    navigate("/");
  };

  const updateUser = (updates: Partial<AuthUser>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      setCookie("authUser", encodeURIComponent(JSON.stringify(updatedUser)), 7);
    }
  };

  const getToken = () => {
    // Check if token is valid before returning it
    if (isAuthenticated && checkTokenExpiration()) {
      return getCookie("accessToken");
    }
    return null;
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isInitialized,
        authData,
        user,
        authLogin,
        authLogout,
        updateUser,
        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
