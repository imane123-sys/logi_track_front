import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { commandeApi } from "../../Api/CommandeApi";
import OrderForm from "./OrderForm";
import ChangerStatutDialog from "./ChangerStatutDialog";
import AjouterProduitDialog from "./AjouterProduitDialog";
import {
  STATUTS_COMMANDE,
  getClientId,
  getClientNom,
  getMontantCommande,
  getStatutCouleur,
  formatDate,
} from "./CommandeUtils";

export default function Orders() {
  const navigate = useNavigate();
  const [commandes, setCommandes] = useState([]);
  const [erreur, setErreur] = useState(null);
  const [filtreStatut, setFiltreStatut] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [commandeStatut, setCommandeStatut] = useState(null);
  const [commandeProduit, setCommandeProduit] = useState(null);

  const chargerCommandes = () => {
    commandeApi
      .getAll()
      .then((data) => setCommandes(data))
      .catch((err) => setErreur(err.message));
  };

  useEffect(() => {
    chargerCommandes();
  }, []);

  const filteredCommandes = (commandes || []).filter(
    (c) => filtreStatut === "" || c.statut === filtreStatut,
  );

  const handleSauvegarderStatut = (nouveauStatut) => {
    commandeApi
      .updateStatus(commandeStatut.id, nouveauStatut)
      .then(() => {
        setCommandes((prev) =>
          prev.map((c) =>
            c.id === commandeStatut.id ? { ...c, statut: nouveauStatut } : c,
          ),
        );
        setCommandeStatut(null);
      })
      .catch((err) => setErreur(err.message));
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f7f9fb", p: 3 }}>
      <Box
        sx={{
          maxWidth: 1100,
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
              Commandes
            </Typography>
            <Typography variant="body2" sx={{ color: "#434655" }}>
              Consultez, créez et gérez les commandes de vos clients.
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => setShowForm(true)}
            sx={{
              bgcolor: "#004ac6",
              "&:hover": { bgcolor: "#003ea8" },
              textTransform: "none",
            }}
          >
            + Ajouter une commande
          </Button>
        </Box>

        {erreur && <Alert severity="error">{erreur}</Alert>}

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
          <TextField
            select
            label="Filtrer par statut"
            value={filtreStatut}
            onChange={(e) => setFiltreStatut(e.target.value)}
            size="small"
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">Tous les statuts</MenuItem>
            {STATUTS_COMMANDE.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </TextField>
          <Chip
            label={`Total: ${filteredCommandes.length}`}
            sx={{ fontWeight: "bold", bgcolor: "#e0e3e5", color: "#191c1e" }}
          />
        </Box>

        {showForm && (
          <OrderForm setShowOrderForm={setShowForm} setCommandes={setCommandes} />
        )}

        <TableContainer
          component={Paper}
          sx={{
            border: "1px solid",
            borderColor: "#c3c6d7",
            borderRadius: 2,
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12)",
            overflow: "hidden",
          }}
        >
          <Table>
            <TableHead sx={{ bgcolor: "#f2f4f6" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", color: "#434655" }}>
                  ID
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#434655" }}>
                  Client
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#434655" }}>
                  Date
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#434655" }}>
                  Statut
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold", color: "#434655" }}>
                  Montant (DH)
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold", color: "#434655" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCommandes.length > 0 ? (
                filteredCommandes.map((c) => {
                  const clientId = getClientId(c);
                  return (
                    <TableRow key={c.id} hover>
                      <TableCell sx={{ fontFamily: "monospace" }}>
                        #{c.id}
                      </TableCell>
                      <TableCell>
                        {clientId ? (
                          <Button
                            size="small"
                            onClick={() =>
                              navigate(`/commandes/client/${clientId}`)
                            }
                            sx={{
                              color: "#004ac6",
                              textTransform: "none",
                              p: 0,
                              minWidth: 0,
                              justifyContent: "flex-start",
                            }}
                          >
                            {getClientNom(c)}
                          </Button>
                        ) : (
                          getClientNom(c)
                        )}
                      </TableCell>
                      <TableCell sx={{ color: "#434655" }}>
                        {formatDate(c.dateCommande)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={c.statut || "-"}
                          size="small"
                          color={getStatutCouleur(c.statut)}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ color: "#191c1e" }}>
                        {getMontantCommande(c).toFixed(2)}
                      </TableCell>
                      <TableCell align="right">
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: 1,
                          }}
                        >
                          <Button
                            size="small"
                            onClick={() => navigate(`/commandes/${c.id}`)}
                            sx={{ color: "#004ac6", textTransform: "none" }}
                          >
                            Voir
                          </Button>
                          <Button
                            size="small"
                            onClick={() => setCommandeStatut(c)}
                            sx={{ color: "#d97706", textTransform: "none" }}
                          >
                            Statut
                          </Button>
                          <Button
                            size="small"
                            onClick={() => setCommandeProduit(c)}
                            sx={{ color: "#7c3aed", textTransform: "none" }}
                          >
                            Produit
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    align="center"
                    sx={{ py: 6, color: "#737686" }}
                  >
                    Aucune commande trouvée.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <ChangerStatutDialog
        open={!!commandeStatut}
        commande={commandeStatut}
        onClose={() => setCommandeStatut(null)}
        onSauvegarder={handleSauvegarderStatut}
      />

      <AjouterProduitDialog
        open={!!commandeProduit}
        commande={commandeProduit}
        onClose={() => setCommandeProduit(null)}
        onSucces={chargerCommandes}
      />
    </Box>
  );
}
