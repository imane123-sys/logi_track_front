import connexion from "./Connexion";

export const commandeApi = {
  getAll: () => connexion.get("/api/orders"),
  getById: (id) => connexion.get(`/api/orders/${id}`),
  create: (params) => connexion.post("/api/orders", null, { params }),
  update: (id, params) => connexion.put(`/api/orders/${id}`, null, { params }),
  updateStatus: (id, statut) => connexion.put(`/api/orders/${id}/edit`, null, { params: { statut } }),
  addProduct: (orderId, idProduit, quantite) =>
    connexion.post(`/api/orders/${orderId}/products`, null, {
      params: { idProduit, quantite },
    }),
  getCommandesByClient: (clientId) => connexion.get(`/api/orders/client/${clientId}`),
  getCount: () => connexion.get("/api/orders/count"),
};
