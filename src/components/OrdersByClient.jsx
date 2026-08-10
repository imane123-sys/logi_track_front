import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
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
import { clientApi } from "../../Api/ClientApi";
import {
  getMontantCommande,
  getStatutCouleur,
  formatDate,
} from "./CommandeUtils";

export default function OrdersByClient() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [commandes, setCommandes] = useState([]);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    clientApi
      .getById(clientId)
      .then((data) => setClient(data))
      .catch((err) => setErreur(err.message));
    commandeApi
      .getCommandesByClient(clientId)
      .then((data) => setCommandes(data || []))
      .catch((err) => setErreur(err.message));
  }, [clientId]);

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
              Commandes du client
            </Typography>
            <Typography variant="body2" sx={{ color: "#434655" }}>
              {client
                ? `${client.nom} ${client.prenom} — ${client.email}`
                : "Chargement du client..."}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              onClick={() => navigate("/commandes")}
              variant="outlined"
              sx={{
                textTransform: "none",
                color: "#191c1e",
                borderColor: "#c3c6d7",
              }}
            >
              Toutes les commandes
            </Button>
          </Box>
        </Box>

        {erreur && <Alert severity="error">{erreur}</Alert>}

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
                  Date
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#434655" }}>
                  Statut
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: "bold", color: "#434655" }}
                >
                  Montant (DH)
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: "bold", color: "#434655" }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {commandes.length > 0 ? (
                commandes.map((c) => (
                  <TableRow key={c.id} hover>
                    <TableCell sx={{ fontFamily: "monospace" }}>
                      #{c.id}
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
                      <Button
                        size="small"
                        onClick={() => navigate(`/commandes/${c.id}`)}
                        sx={{ color: "#004ac6", textTransform: "none" }}
                      >
                        Voir
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    align="center"
                    sx={{ py: 6, color: "#737686" }}
                  >
                    Aucune commande pour ce client.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
