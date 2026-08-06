import { jwtDecode } from "jwt-decode";
import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext(null);

const resolveToken = (payload) => {
  if (typeof payload === "string") {
    return payload;
  }

  if (payload && typeof payload === "object") {
    return (
      payload.token ||
      payload.accessToken ||
      payload.jwt ||
      payload.data?.token ||
      payload.data?.accessToken ||
      payload.data?.jwt ||
      null
    );
  }

  return null;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("hc_token");
    const savedUser = localStorage.getItem("hc_user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);
  const loginUser = (payload) => {
    const tokenString = resolveToken(payload);

    if (!tokenString) {
      throw new Error("Token de connexion introuvable dans la réponse.");
    }

    const decodedToken = jwtDecode(tokenString);

    const userEmail = decodedToken.sub;
    const userRoles = decodedToken.roles || [];

    localStorage.setItem("hc_token", tokenString);

    localStorage.setItem(
      "hc_user",
      JSON.stringify({
        email: userEmail,
        roles: userRoles,
      }),
    );
    setToken(tokenString);
    setUser({
      email: userEmail,
      roles: userRoles,
    });
  };
  const logoutUser = () => {
    localStorage.removeItem("hc_token");
    localStorage.removeItem("hc_user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loginUser, logoutUser, loading }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);
