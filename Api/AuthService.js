import connexion from "./Connexion";
export const login = async (email, password) => {
  return connexion.post("/api/auth/login", {
    email,
    password,
  });
};
export const register = async (nom, prenom, email, password, role) => {
  const response = await connexion.post("/api/auth/register", {
    nom,
    prenom,
    email,
    password,
    role,
  });

  return response;
};
