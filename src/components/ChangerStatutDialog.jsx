import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";
import { STATUTS_COMMANDE } from "./CommandeUtils";

export default function ChangerStatutDialog({ open, commande, onClose, onSauvegarder }) {
  const [statut, setStatut] = useState(STATUTS_COMMANDE[0]);

  useEffect(() => {
    if (open) {
      setStatut(commande?.statut || STATUTS_COMMANDE[0]);
    }
  }, [open, commande]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSauvegarder(statut);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, color: "#191c1e" }}>
        Modifier le statut
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            select
            label="Statut"
            value={statut}
            onChange={(e) => setStatut(e.target.value)}
            fullWidth
            required
          >
            {STATUTS_COMMANDE.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </TextField>
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
