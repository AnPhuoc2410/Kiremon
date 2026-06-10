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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";
const ACCESS_TOKEN_TTL_MS = 15 * 60 * 1000; // 15 minutes

const parseStoredUser = (storedUserCookie: string | null): AuthUser | null => {
  if (!storedUserCookie) return null;
  try {
    return JSON.parse(decodeURIComponent(storedUserCookie));
  } catch (err) {
    console.warn("Failed to parse stored user", err);
    return null;
  }
};

interface SilentRefreshResult {
  token: string;
  expiresAt: string | null;
}

const silentRefresh = async (): Promise<SilentRefreshResult> => {
  const response = await axios.post(
    `${API_BASE_URL}/auth/refresh`,
    {},
    { withCredentials: true },
  );
  return {
    token: response.data.token,
    expiresAt: response.data.expiresAt || null,
  };
};

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
      const storedUserCookie = getCookie("authUser");
      if (!storedUserCookie) {
        setIsInitialized(true);
        return;
      }

      try {
        const { token, expiresAt } = await silentRefresh();
        setMemoryToken(token);

        const parsedUser = parseStoredUser(storedUserCookie);
        if (parsedUser) {
          setIsAuthenticated(true);
          setUser(parsedUser);
          setAuthData({
            accessToken: token,
            expires: expiresAt
              ? new Date(expiresAt).toISOString()
              : new Date(Date.now() + ACCESS_TOKEN_TTL_MS).toISOString(),
            user: parsedUser,
          });
        } else {
          eraseCookie("authUser");
        }
      } catch (refreshErr) {
        console.warn("Silent refresh failed during init:", refreshErr);
        eraseCookie("authUser");
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

  const authLogin = (loginData: AuthLoginData): void => {
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
    // 1. Clear token & cookie first to prevent race condition window
    setMemoryToken(null);
    eraseCookie("authUser");

    // 2. Clear state next
    setIsAuthenticated(false);
    setAuthData(null);
    setUser(null);

    // 3. Make API call last
    axios
      .post(`${API_BASE_URL}/auth/revoke`, {}, { withCredentials: true })
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
