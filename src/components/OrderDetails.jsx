import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { commandeApi } from "../../Api/CommandeApi";
import ChangerStatutDialog from "./ChangerStatutDialog";
import AjouterProduitDialog from "./AjouterProduitDialog";
import {
  getClientId,
  getClientNom,
  getClientPrenom,
  getLignesCommande,
  getMontantCommande,
  getStatutCouleur,
  formatDate,
} from "./CommandeUtils";

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [commande, setCommande] = useState(null);
  const [erreur, setErreur] = useState(null);
  const [showStatut, setShowStatut] = useState(false);
  const [showProduit, setShowProduit] = useState(false);

  useEffect(() => {
    commandeApi
      .getById(id)
      .then((data) => setCommande(data))
      .catch((err) => setErreur(err.message));
  }, [id]);

  const handleSauvegarderStatut = (nouveauStatut) => {
    commandeApi
      .updateStatus(commande.id, nouveauStatut)
      .then(() => {
        setCommande((prev) => ({ ...prev, statut: nouveauStatut }));
        setShowStatut(false);
      })
      .catch((err) => setErreur(err.message));
  };

  const handleProduitAjoute = () => {
    commandeApi
      .getById(id)
      .then((data) => setCommande(data))
      .catch((err) => setErreur(err.message));
  };

  if (!commande && !erreur) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "#f7f9fb", p: 3 }}>
        <Typography sx={{ color: "#434655" }}>Chargement...</Typography>
      </Box>
    );
  }

  if (erreur) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "#f7f9fb", p: 3 }}>
        <Alert severity="error">{erreur}</Alert>
        <Button onClick={() => navigate("/commandes")} sx={{ mt: 2, textTransform: "none" }}>
          Retour aux commandes
        </Button>
      </Box>
    );
  }

  const lignes = getLignesCommande(commande);
  const clientId = getClientId(commande);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f7f9fb", p: 3 }}>
      <Box
        sx={{
          maxWidth: 900,
          mx: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight={700} sx={{ color: "#191c1e" }}>
              Commande #{commande.id}
            </Typography>
            <Typography variant="body2" sx={{ color: "#434655" }}>
              Détails de la commande du {formatDate(commande.dateCommande)}.
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              onClick={() => navigate("/commandes")}
              variant="outlined"
              sx={{ textTransform: "none", color: "#191c1e", borderColor: "#c3c6d7" }}
            >
              Retour
            </Button>
            <Button
              onClick={() => setShowStatut(true)}
              sx={{
                color: "#d97706",
                textTransform: "none",
                borderColor: "#c3c6d7",
              }}
              variant="outlined"
            >
              Modifier le statut
            </Button>
            <Button
              onClick={() => setShowProduit(true)}
              variant="contained"
              sx={{
                bgcolor: "#004ac6",
                "&:hover": { bgcolor: "#003ea8" },
                textTransform: "none",
              }}
            >
              + Ajouter un produit
            </Button>
          </Box>
        </Box>

        <Paper
          sx={{
            border: "1px solid",
            borderColor: "#c3c6d7",
            borderRadius: 2,
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12)",
            p: 3,
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 2,
              mb: 2,
            }}
          >
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight="bold">
                CLIENT
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {getClientNom(commande)} {getClientPrenom(commande)}
              </Typography>
              {clientId && (
                <Button
                  size="small"
                  onClick={() => navigate(`/commandes/client/${clientId}`)}
                  sx={{ color: "#004ac6", textTransform: "none", p: 0, mt: 1 }}
                >
                  Voir toutes ses commandes
                </Button>
              )}
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight="bold">
                DATE
              </Typography>
              <Typography variant="body1">{formatDate(commande.dateCommande)}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight="bold">
                STATUT
              </Typography>
              <Box sx={{ mt: 0.5 }}>
                <Chip
                  label={commande.statut || "-"}
                  size="small"
                  color={getStatutCouleur(commande.statut)}
                  variant="outlined"
                />
              </Box>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight="bold">
                MONTANT TOTAL
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {getMontantCommande(commande).toFixed(2)} DH
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography
            variant="caption"
            color="text.secondary"
            fontWeight="bold"
            display="block"
            sx={{ mb: 1 }}
          >
            PRODUITS DE LA COMMANDE
          </Typography>
          {lignes.length > 0 ? (
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead sx={{ bgcolor: "#f9fafb" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold", color: "#374151" }}>
                      Produit
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold", color: "#374151" }}>
                      Prix (DH)
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold", color: "#374151" }}>
                      Quantité
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold", color: "#374151" }}>
                      Sous-total (DH)
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lignes.map((item, index) => {
                    const prix = Number(item.produit?.prix ?? item.prix ?? 0);
                    const quantite = Number(
                      item.quantite ?? item.quantiteCommande ?? 1,
                    );
                    const nomProduit =
                      item.produit?.nom ?? item.nomProduit ?? `Produit #${index + 1}`;
                    return (
                      <TableRow key={item.id ?? index} hover>
                        <TableCell>{nomProduit}</TableCell>
                        <TableCell align="right">{prix.toFixed(2)}</TableCell>
                        <TableCell align="right">{quantite}</TableCell>
                        <TableCell align="right">
                          {(prix * quantite).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Aucun produit ajouté à cette commande.
            </Typography>
          )}
        </Paper>
      </Box>

      <ChangerStatutDialog
        open={showStatut}
        commande={commande}
        onClose={() => setShowStatut(false)}
        onSauvegarder={handleSauvegarderStatut}
      />

      <AjouterProduitDialog
        open={showProduit}
        commande={commande}
        onClose={() => setShowProduit(false)}
        onSucces={handleProduitAjoute}
      />
    </Box>
  );
}
