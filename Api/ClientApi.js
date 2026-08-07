import connexion from "./Connexion";

export const clientApi = {
  getAll: () => connexion.get("/api/clients"),
  getById: (id) => connexion.get(`/api/clients/${id}`),
  create: (data) => connexion.post("/api/clients", data),
  update: (id, data) => connexion.put(`/api/clients/${id}`, data),
  delete: (id) => connexion.delete(`/api/clients/${id}`),
};
