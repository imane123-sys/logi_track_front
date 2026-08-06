import { createContext, useState } from "react";
import { jwtDecode } from "jwt-decode";
import {
  login as loginApi,
  register as registerApi,
} from "../../Api/AuthService";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [error, setError] = useState(null);

  const extractToken = (response) => {
    if (typeof response === "string") return response;
    if (typeof response === "object" && response !== null) {
      return response.token
        || response.accessToken
        || response.access_token
        || response.data?.token
        || response.data?.accessToken
        || response.data?.access_token
        || null;
    }
    return null;
  };

  const extractRole = (decoded, response) => {
    const fromJwt = decoded.authorities
      || decoded.authority
      || decoded.role
      || decoded.roles
      || decoded.scope;
    if (fromJwt) return fromJwt;

    if (typeof response === "object" && response !== null) {
      return response.role || response.roles || response.data?.role || [];
    }
    return [];
  };

  const login = async (credentials) => {
    setError(null);
    try {
      const response = await loginApi(credentials.email, credentials.password);
      const jwtToken = extractToken(response);

      if (!jwtToken || typeof jwtToken !== "string") {
        throw new Error("Aucun jeton valide reçu du serveur.");
      }

      const decoded = jwtDecode(jwtToken);
      const userData = {
        email: decoded.sub,
        role: extractRole(decoded, response),
      };

      localStorage.setItem("token", jwtToken);
      localStorage.setItem("user", JSON.stringify(userData));

      setToken(jwtToken);
      setUser(userData);
      return true;
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Identifiants incorrects.",
      );
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{ token, user, error, login, logout, isAuthenticated: !!token }}
    >
      {children}
    </AuthContext.Provider>
  );
}
