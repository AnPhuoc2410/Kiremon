import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLoginData, AuthUser } from "@/types/auth.types";
import {
  eraseCookie,
  getCookie,
  setCookie,
} from "@/components/utils/cookieUtils";
import toast from "react-hot-toast";
import axios from "axios";
import { getMemoryToken, setMemoryToken } from "@/services/api/tokenHolder";
import { presenceHub } from "@/services/signalr/presence.hub";
import { AchievementToast } from "@/components/achievements/AchievementToast";

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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [authData, setAuthData] = useState<AuthLoginData | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = getCookie("authUser");

        if (storedUser) {
          try {
            const response = await axios.post(
              `${import.meta.env.VITE_API_BASE_URL || "/api"}/auth/refresh`,
              {},
              { withCredentials: true },
            );

            const token = response.data.token;
            setMemoryToken(token);

            let parsedUser: AuthUser | null = null;
            try {
              parsedUser = JSON.parse(decodeURIComponent(storedUser));
            } catch {
              console.warn("Failed to parse stored user");
            }

            setIsAuthenticated(true);
            setUser(parsedUser);
            setAuthData({
              accessToken: token,
              expires: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
              user: parsedUser!,
            });
          } catch (refreshErr) {
            console.warn("Silent refresh failed during init:", refreshErr);
            eraseCookie("authUser");
          }
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();

    const handleUnauthorizedLogout = () => {
      authLogout();
    };

    window.addEventListener("unauthorized-logout", handleUnauthorizedLogout);

    return () => {
      window.removeEventListener(
        "unauthorized-logout",
        handleUnauthorizedLogout,
      );
    };
  }, []);

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

    setMemoryToken(loginData.accessToken);
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

    setMemoryToken(null);
    eraseCookie("authUser");

    axios
      .post(
        `${import.meta.env.VITE_API_BASE_URL || "/api"}/auth/revoke`,
        {},
        { withCredentials: true },
      )
      .catch((err) => console.warn("Failed to call revoke on server", err));

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
    return getMemoryToken();
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
