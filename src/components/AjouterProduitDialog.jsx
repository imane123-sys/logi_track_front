import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { productApi } from "../../Api/ProductApi";
import { commandeApi } from "../../Api/CommandeApi";

export default function AjouterProduitDialog({
  open,
  commande,
  onClose,
  onSucces,
}) {
  const [produits, setProduits] = useState([]);
  const [idProduit, setIdProduit] = useState("");
  const [quantite, setQuantite] = useState(1);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState(null);



  useEffect(() => {
    if (!open) return;
    setIdProduit("");
    setQuantite(1);
    setErreur(null);
    productApi
      .getAll()
      .then((data) => {
        const list = data?.content ?? data;
        setProduits(Array.isArray(list) ? list : []);
      })
      .catch((err) => setErreur(err.message));
  }, [open]);

  

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!idProduit || !commande) return;
    setChargement(true);
    setErreur(null);
    commandeApi
      .addProduct(commande.id, idProduit, Number(quantite))
      .then(() => {
        onSucces();
        onClose();
      })
      .catch((err) => setErreur(err.message))
      .finally(() => setChargement(false));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, color: "#191c1e" }}>
        Ajouter un produit à la commande
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          {erreur && <Alert severity="error">{erreur}</Alert>}
          <TextField
            select
            label="Produit"
            value={idProduit}
            onChange={(e) => setIdProduit(e.target.value)}
            required
            fullWidth
          >
            {produits.length > 0 ? (
              produits.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.nom} — {p.prix} DH
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled value="">
                Aucun produit disponible
              </MenuItem>
            )}
          </TextField>
          <TextField
            label="Quantité"
            type="number"
            value={quantite}
            onChange={(e) => setQuantite(e.target.value)}
            slotProps={{ htmlInput: { min: 1 } }}
            required
            fullWidth
          />
          <Typography variant="caption" color="text.secondary">
            Commande #{commande?.id ?? "-"} — produit ajouté avec son prix et sa
            quantité.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={onClose}
            color="inherit"
            sx={{ textTransform: "none" }}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={chargement || !idProduit}
            sx={{
              bgcolor: "#004ac6",
              "&:hover": { bgcolor: "#003ea8" },
              textTransform: "none",
            }}
          >
            {chargement ? "Ajout en cours..." : "Ajouter"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
