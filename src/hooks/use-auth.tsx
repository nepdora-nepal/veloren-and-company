"use client";

import { useContext } from "react";
import { AuthContext } from "@/contexts/auth-context";

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
/*                           RE-EXPORTS                                       */
/* -------------------------------------------------------------------------- */

export { AuthProvider, getAccessToken, getRefreshToken } from "@/contexts/auth-context";
