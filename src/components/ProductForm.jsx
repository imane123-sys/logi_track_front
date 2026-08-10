import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

const emptyForm = {
  nom: "",
  categorie: "",
  description: "",
  prix: "",
  quantiteStock: "",
};

export default function ProductForm({ open, product, onClose, onSave }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (product) {
      setForm({
        nom: product.nom || "",
        categorie: product.categorie || "",
        prix: product.prix ?? "",
        quantiteStock: product.quantiteStock ?? "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [product, open]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      prix: Number(form.prix),
      quantiteStock: Number(form.quantiteStock),
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, color: "#191c1e" }}>
        {product ? "Modifier le produit" : "Ajouter un produit"}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Nom"
            name="nom"
            value={form.nom}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Catégorie"
            name="categorie"
            value={form.categorie}
            onChange={handleChange}
            required
            fullWidth
            placeholder="ex: Électronique"
          />
          <TextField
            label="Prix (DH)"
            name="prix"
            type="number"
            value={form.prix}
            onChange={handleChange}
            inputProps={{ min: 0, step: "any" }}
            required
            fullWidth
          />
          <TextField
            label="Quantité en stock"
            name="quantiteStock"
            type="number"
            value={form.quantiteStock}
            onChange={handleChange}
            inputProps={{ min: 0 }}
            required
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="inherit" sx={{ textTransform: "none" }}>
            Annuler
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{
              bgcolor: "#004ac6",
              "&:hover": { bgcolor: "#003ea8" },
              textTransform: "none",
            }}
          >
            Enregistrer
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
