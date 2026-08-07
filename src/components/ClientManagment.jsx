import React, { useState, useContext } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Chip,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from "@mui/material";
import { ClientContext } from "./ClientContext";

export default function ClientManagement({ canDelete = true }) {
  const { clients, loading, error, addClient, updateClient, deleteClient } =
    useContext(ClientContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [editingClient, setEditingClient] = useState(null);

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    ville: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOpenAdd = () => {
    setEditingClient(null);
    setFormData({ nom: "", prenom: "", email: "", telephone: "", ville: "" });
    setShowAddModal(true);
  };

  const handleOpenEdit = (client) => {
    setEditingClient(client);
    setFormData({
      nom: client.nom || "",
      prenom: client.prenom || "",
      email: client.email || "",
      telephone: client.telephone || "",
      ville: client.ville || "",
    });
    setShowAddModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let success = false;
    if (editingClient) {
      success = await updateClient(editingClient.id, formData);
    } else {
      success = await addClient(formData);
    }
    if (success) {
      setFormData({ nom: "", prenom: "", email: "", telephone: "", ville: "" });
      setShowAddModal(false);
      setEditingClient(null);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) {
      await deleteClient(id);
    }
  };

  const filteredClients = (clients || []).filter(
    (c) =>
      c.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.ville?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", p: 3, display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: 1,
          borderColor: "divider",
          pb: 2,
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight="bold">
            Gestion des Clients
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gérez vos clients, consultez leurs détails et ajoutez de nouvelles entrées.
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={handleOpenAdd}
          sx={{
            bgcolor: "#4f46e5",
            "&:hover": { bgcolor: "#4338ca" },
            textTransform: "none",
            borderRadius: 2,
          }}
        >
          + Nouveau Client
        </Button>
      </Box>

      {error && (
        <Alert severity="error">
          {error}
        </Alert>
      )}

      {/* Search & Counter Bar */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
        <TextField
          placeholder="Rechercher par nom, prénom, email, ville..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          sx={{ flexGrow: 1, maxWidth: 450 }}
        />
        <Chip
          label={`Total: ${filteredClients.length}`}
          sx={{ fontWeight: "bold", bgcolor: "#f3f4f6", color: "#4b5563" }}
        />
      </Box>

      {/* Table Section */}
      <TableContainer component={Paper} variant="outlined">
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableHead sx={{ bgcolor: "#f9fafb" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", color: "#374151" }}>ID</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#374151" }}>Nom</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#374151" }}>Prénom</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#374151" }}>Téléphone</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#374151" }}>Ville</TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold", color: "#374151" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredClients.length > 0 ? (
                filteredClients.map((client) => (
                  <TableRow key={client.id} hover>
                    <TableCell sx={{ fontFamily: "monospace" }}>#{client.id}</TableCell>
                    <TableCell sx={{ fontWeight: "medium" }}>{client.nom}</TableCell>
                    <TableCell>{client.prenom}</TableCell>
                    <TableCell>{client.telephone}</TableCell>
                    <TableCell>
                      <Chip label={client.ville} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                        <Button
                          size="small"
                          onClick={() => setSelectedClient(client)}
                          sx={{ color: "#4f46e5", "&:hover": { bgcolor: "#f5f3ff" }, textTransform: "none" }}
                        >
                          Voir
                        </Button>
                        <Button
                          size="small"
                          onClick={() => handleOpenEdit(client)}
                          sx={{ color: "#d97706", "&:hover": { bgcolor: "#fef3c7" }, textTransform: "none" }}
                        >
                          Modifier
                        </Button>
                        {canDelete && (
                          <Button
                            size="small"
                            color="error"
                            onClick={() => handleDelete(client.id)}
                            sx={{ "&:hover": { bgcolor: "#fef2f2" }, textTransform: "none" }}
                          >
                            Supprimer
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6, color: "text.disabled" }}>
                    Aucun client trouvé.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {/* Dialog 1: Voir Détails */}
      {selectedClient && (
        <Dialog open={!!selectedClient} onClose={() => setSelectedClient(null)} maxWidth="sm" fullWidth>
          <DialogTitle>Détails du Client #{selectedClient.id}</DialogTitle>
          <DialogContent dividers>
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2, mb: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight="bold">NOM</Typography>
                <Typography variant="body1">{selectedClient.nom || "-"}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight="bold">PRÉNOM</Typography>
                <Typography variant="body1">{selectedClient.prenom || "-"}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight="bold">EMAIL</Typography>
                <Typography variant="body1">{selectedClient.email || "-"}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight="bold">TÉLÉPHONE</Typography>
                <Typography variant="body1">{selectedClient.telephone || "-"}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight="bold">VILLE</Typography>
                <Typography variant="body1">{selectedClient.ville || "-"}</Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />
            
            <Typography variant="caption" color="text.secondary" fontWeight="bold" display="block" sx={{ mb: 1 }}>
              COMMANDES ASSOCIÉES
            </Typography>
            {selectedClient.commandes && selectedClient.commandes.length > 0 ? (
              <Box component="ul" sx={{ m: 0, p: 0, listStyle: "none", maxHeight: 150, overflowY: "auto" }}>
                {selectedClient.commandes.map((cmd) => (
                  <Box component="li" key={cmd.id} sx={{ py: 1, display: "flex", justifyContent: "space-between", borderBottom: "1px solid", borderColor: "divider" }}>
                    <Typography variant="body2">Commande #{cmd.id}</Typography>
                    <Typography variant="body2" color="text.secondary">{cmd.statut || "En cours"}</Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">Aucune commande enregistrée pour ce client.</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedClient(null)} color="primary">Fermer</Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Dialog 2: Ajouter/Modifier un Client */}
      {showAddModal && (
        <Dialog open={showAddModal} onClose={() => setShowAddModal(false)} maxWidth="xs" fullWidth>
          <DialogTitle>{editingClient ? "Modifier le Client" : "Ajouter un Client"}</DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2 }}>
                <TextField
                  label="Nom"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                  size="small"
                  fullWidth
                />
                <TextField
                  label="Prénom"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  required
                  size="small"
                  fullWidth
                />
              </Box>
              <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                size="small"
                fullWidth
              />
              <TextField
                label="Téléphone"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                required
                size="small"
                fullWidth
              />
              <TextField
                label="Ville"
                name="ville"
                value={formData.ville}
                onChange={handleChange}
                required
                size="small"
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowAddModal(false)} color="inherit">Annuler</Button>
              <Button type="submit" variant="contained" disabled={loading} sx={{ bgcolor: "#4f46e5", "&:hover": { bgcolor: "#4338ca" } }}>
                {loading ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      )}
    </Box>
  );
}
