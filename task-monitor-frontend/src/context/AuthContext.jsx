import { createContext, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

/** Build a user object from a decoded JWT */
function buildUser(decoded) {
  // JWT stores roles as array e.g. ["ADMIN"] or ["USER"]
  const roles = Array.isArray(decoded.roles)
    ? decoded.roles
    : decoded.role
    ? [decoded.role]
    : [];

  return {
    loggedIn: true,
    email: decoded.sub || decoded.email,
    roles,
    // Convenience flag — true if any role contains "ADMIN"
    isAdmin: roles.some((r) => r.toUpperCase().includes("ADMIN")),
    rawToken: decoded,
  };
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Prioritize sessionStorage for tab isolation
    let token = sessionStorage.getItem("token");
    
    // If no session token, check local storage (persistent token from another tab's rememberMe)
    if (!token) {
      token = localStorage.getItem("token");
      if (token) {
        // Copy it into this tab's session storage so this tab is now isolated with this account
        sessionStorage.setItem("token", token);
        const rToken = localStorage.getItem("refreshToken");
        if (rToken) sessionStorage.setItem("refreshToken", rToken);
      }
    }

    if (token) {
      try {
        return buildUser(jwtDecode(token));
      } catch (err) {
        console.error("Failed to decode token", err);
        sessionStorage.removeItem("token");
        return null;
      }
    }
    return null;
  });

  const login = (token, refreshToken, rememberMe = false) => {
    try {
      // ALWAYS isolate the current tab to the new login
      sessionStorage.setItem("token", token);
      if (refreshToken) sessionStorage.setItem("refreshToken", refreshToken);

      if (rememberMe) {
        // Set as default for future tabs
        localStorage.setItem("token", token);
        if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
      }
      setUser(buildUser(jwtDecode(token)));
    } catch (err) {
      console.error("Failed to decode token on login", err);
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("token");
    localStorage.removeItem("token");
    sessionStorage.removeItem("refreshToken");
    localStorage.removeItem("refreshToken");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};