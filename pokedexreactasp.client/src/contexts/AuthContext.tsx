import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLoginData, AuthUser } from "../types/auth.types";
import { eraseCookie, getCookie, setCookie } from "../components/utils/cookieUtils";
import toast from "react-hot-toast";

interface AuthContextType {
  isAuthenticated: boolean;
  isInitialized: boolean;
  authData: AuthLoginData | null;
  user: AuthUser | null;
  authLogin: (data: AuthLoginData) => void;
  authLogout: () => void;
  getToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

  const authLogin = (loginData: AuthLoginData): void => {
    if (!loginData?.accessToken || !loginData?.user) {
      console.error("Invalid login data");
      return;
    }

    setIsAuthenticated(true);
    setAuthData(loginData);
    setUser(loginData.user);

    setCookie("accessToken", loginData.accessToken, 7);
    setCookie("expires", loginData.expires, 7);
    setCookie("authUser", encodeURIComponent(JSON.stringify(loginData.user)), 7);
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
