import connexion from "./Connexion";

export const productApi = {
  getAll: () => connexion.get("/api/products"),
  getById: (id) => connexion.get(`/api/products/${id}`),
  create: (data) => connexion.post("/api/products", data),
  update: (id, data) => connexion.put(`/api/products/${id}`, data),
  delete: (id) => connexion.delete(`/api/products/${id}`),
  findByPrix: (prix) => connexion.get(`/api/products/findProduitParPrix/${prix}`),
};
