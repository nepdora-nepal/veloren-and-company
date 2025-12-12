"use client";

import  { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { loginUser, signupUser } from "@/services/auth";
import { User, AuthTokens, DecodedAccessToken, LoginResponse } from "@/types/auth";
import { toast } from "sonner";

/* -------------------------------------------------------------------------- */
/*                              TOKEN UTILITIES                               */
/* -------------------------------------------------------------------------- */

const AUTH_TOKENS_KEY = "glow-authTokens";

// Decode JWT token to get user info
const decodeToken = (token: string): DecodedAccessToken | null => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

/* -------------------------------------------------------------------------- */
/*                              AUTH CONTEXT                                  */
/* -------------------------------------------------------------------------- */

interface AuthContextType {
  user: User | null;
  tokens: AuthTokens | null;
  login: (data: { email: string; password: string }) => Promise<void>;
  signup: (data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone?: string;
    address?: string;
  }) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* -------------------------------------------------------------------------- */
/*                              AUTH PROVIDER                                 */
/* -------------------------------------------------------------------------- */

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check for existing tokens on mount
  useEffect(() => {
    const storedTokens = localStorage.getItem(AUTH_TOKENS_KEY);
    if (storedTokens) {
      try {
        const parsedTokens: AuthTokens = JSON.parse(storedTokens);
        const decodedAccess = decodeToken(parsedTokens.access);

        if (decodedAccess && decodedAccess.exp * 1000 > Date.now()) {
          setTokens(parsedTokens);
          setUser({
            id: decodedAccess.user_id,
            email: decodedAccess.email,
            username: decodedAccess.email,
            first_name: decodedAccess.first_name,
            last_name: decodedAccess.last_name,
            phone: decodedAccess.phone,
            address: decodedAccess.address,
          });
        } else {
          // Token expired
          localStorage.removeItem(AUTH_TOKENS_KEY);
          if (decodedAccess) {
            toast.error("Session expired. Please log in again.");
          }
        }
      } catch (error) {
        console.error("Failed to parse stored tokens:", error);
        localStorage.removeItem(AUTH_TOKENS_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  // Handle successful auth
  const handleAuthSuccess = (userData: User, tokenData: AuthTokens) => {
    setUser(userData);
    setTokens(tokenData);
    localStorage.setItem(AUTH_TOKENS_KEY, JSON.stringify(tokenData));
  };

  // Get error message from API response
  const getErrorMessage = (error: Error & { response?: { status?: number; data?: Record<string, unknown> } }) => {
    if (error.response) {
      const data = error.response.data;
      
      if (data?.errors && Array.isArray(data.errors) && data.errors.length > 0) {
        return (data.errors[0] as { message?: string }).message || "An error occurred";
      }
      
      return (data?.message || data?.error || data?.detail || error.message) as string;
    }
    return error.message || "An unexpected error occurred";
  };

  // Login function
  const login = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const response: LoginResponse = await loginUser(data);

      const accessToken = response.tokens.access;
      const refreshToken = response.tokens.refresh;

      if (!accessToken) {
        throw new Error("No access token received from server");
      }

      const decodedAccess = decodeToken(accessToken);
      if (!decodedAccess) {
        throw new Error("Failed to decode access token");
      }

      const loggedInUser: User = {
        id: decodedAccess.user_id,
        email: decodedAccess.email,
        username: decodedAccess.email,
        first_name: decodedAccess.first_name,
        last_name: decodedAccess.last_name,
        phone: decodedAccess.phone,
        address: decodedAccess.address,
      };

      handleAuthSuccess(loggedInUser, {
        access: accessToken,
        refresh: refreshToken,
      });

      toast.success("Login successful! Welcome back!");

      // Handle redirect
      const redirectUrl = sessionStorage.getItem("redirectAfterLogin");
      if (redirectUrl) {
        sessionStorage.removeItem("redirectAfterLogin");
        router.push(redirectUrl);
      } else {
        router.push("/");
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error as Error);
      toast.error(errorMessage);
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function
  const signup = async (data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone?: string;
    address?: string;
  }) => {
    setIsLoading(true);
    try {
      await signupUser({
        ...data,
        website_type: "ecommerce",
      });

      toast.success("Account created successfully! Please log in to continue.");
      router.push("/auth");
    } catch (error) {
      const errorMessage = getErrorMessage(error as Error);
      toast.error(errorMessage);
      console.error("Signup error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setTokens(null);
    localStorage.removeItem(AUTH_TOKENS_KEY);
    sessionStorage.removeItem("redirectAfterLogin");
    toast.success("You have been successfully logged out.");
    router.push("/auth");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        tokens,
        login,
        signup,
        logout,
        isLoading,
        isAuthenticated: !!user && !!tokens,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* -------------------------------------------------------------------------- */
/*                              USE AUTH HOOK                                 */
/* -------------------------------------------------------------------------- */

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

/* -------------------------------------------------------------------------- */
/*                           TOKEN ACCESS HELPERS                             */
/* -------------------------------------------------------------------------- */

export const getAccessToken = (): string | null => {
  if (typeof window === "undefined") return null;
  try {
    const storedTokens = localStorage.getItem(AUTH_TOKENS_KEY);
    if (storedTokens) {
      const parsedTokens: AuthTokens = JSON.parse(storedTokens);
      return parsedTokens.access;
    }
  } catch {
    return null;
  }
  return null;
};

export const getRefreshToken = (): string | null => {
  if (typeof window === "undefined") return null;
  try {
    const storedTokens = localStorage.getItem(AUTH_TOKENS_KEY);
    if (storedTokens) {
      const parsedTokens: AuthTokens = JSON.parse(storedTokens);
      return parsedTokens.refresh;
    }
  } catch {
    return null;
  }
  return null;
};
