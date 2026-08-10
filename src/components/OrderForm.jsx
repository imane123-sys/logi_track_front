import React, { useEffect, useState } from "react";
import { Alert, Box, Button, MenuItem, TextField } from "@mui/material";
import { commandeApi } from "../../Api/CommandeApi";
import { clientApi } from "../../Api/ClientApi";
import { STATUTS_COMMANDE } from "./CommandeUtils";

export default function OrderForm({ setShowOrderForm, setCommandes }) {
  const [clients, setClients] = useState([]);
  const [idClient, setIdClient] = useState("");
  const [dateCommande, setDateCommande] = useState("");
  const [statut, setStatut] = useState("EN_ATTENTE");
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    clientApi
      .getAll()
      .then((data) => setClients(data))
      .catch((err) => setErreur(err.message));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    commandeApi
      .create({ dateCommande, statut, idClient })
      .then((data) => {
        setCommandes((prev) => [...prev, data]);
        setShowOrderForm(false);
      })
      .catch((err) => setErreur(err.message));
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        border: "1px solid",
        borderColor: "#c3c6d7",
        borderRadius: 2,
        p: 3,
        bgcolor: "white",
      }}
    >
      {erreur && <Alert severity="error">{erreur}</Alert>}

      <TextField
        select
        label="Client"
        value={idClient}
        onChange={(e) => setIdClient(e.target.value)}
        required
        fullWidth
      >
        {clients.map((client) => (
          <MenuItem key={client.id} value={client.id}>
            {client.nom} {client.prenom}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="Date de commande"
        type="date"
        value={dateCommande}
        onChange={(e) => setDateCommande(e.target.value)}
        required
        fullWidth
        InputLabelProps={{ shrink: true }}
      />

      <TextField
        select
        label="Statut"
        value={statut}
        onChange={(e) => setStatut(e.target.value)}
        required
        fullWidth
      >
        {STATUTS_COMMANDE.map((s) => (
          <MenuItem key={s} value={s}>
            {s}
          </MenuItem>
        ))}
      </TextField>

      <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
        <Button
          type="submit"
          variant="contained"
          sx={{
            bgcolor: "#004ac6",
            "&:hover": { bgcolor: "#003ea8" },
            textTransform: "none",
          }}
        >
          Ajouter
        </Button>
        <Button onClick={() => setShowOrderForm(false)} color="inherit">
          Annuler
        </Button>
      </Box>
    </Box>
  );
}
