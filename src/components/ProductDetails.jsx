import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Divider,
} from "@mui/material";

export default function ProductDetails({ open, product, onClose }) {
  if (!product) return null;

  const detailItem = (label, value) => (
    <Box sx={{ mb: 2 }}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1">{value || "-"}</Typography>
    </Box>
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Détails du produit #{product.id}</DialogTitle>
      <DialogContent dividers>
        {detailItem("Nom", product.nom)}
        {detailItem("Catégorie", product.categorie)}
        {detailItem("Description", product.description)}
        <Divider sx={{ my: 2 }} />
        {detailItem("Prix", `${product.prix} DH`)}
        {detailItem("Stock", `${product.stock} unités`)}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
}
