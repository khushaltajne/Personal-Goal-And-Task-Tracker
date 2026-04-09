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
    // Prioritize sessionStorage for tab isolation, fallback to localStorage for persistence
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    if (token) {
      try {
        return buildUser(jwtDecode(token));
      } catch (err) {
        console.error("Failed to decode token", err);
        sessionStorage.removeItem("token");
        localStorage.removeItem("token");
        return null;
      }
    }
    return null;
  });

  const login = (token, refreshToken, rememberMe = false) => {
    try {
      if (rememberMe) {
        localStorage.setItem("token", token);
        if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
      } else {
        sessionStorage.setItem("token", token);
        if (refreshToken) sessionStorage.setItem("refreshToken", refreshToken);
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