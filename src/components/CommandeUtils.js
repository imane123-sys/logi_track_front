export const STATUTS_COMMANDE = ["EN_ATTENTE", "EXPEDIEE", "LIVREE"];

export const getStatutCouleur = (statut) => {
  if (statut === "LIVREE") return "success";
  if (statut === "EXPEDIEE") return "info";
  return "warning";
};

export const getClientId = (c) => c?.client?.id ?? c?.idClient ?? null;

export const getClientNom = (c) => c?.client?.nom ?? c?.clientNom ?? "-";

export const getClientPrenom = (c) => c?.client?.prenom ?? "-";

export const getLignesCommande = (c) =>
  c?.commandeProduits || c?.produits || c?.items || [];

export const getMontantCommande = (c) =>
  getLignesCommande(c).reduce(
    (somme, item) =>
      somme +
      Number(item.produit?.prix ?? item.prix ?? 0) *
        Number(item.quantite ?? item.quantiteCommande ?? 1),
    0,
  );

export const formatDate = (date) => {
  if (!date) return "-";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("fr-FR");
};
