import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function AccessDenied() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
      }}
    >
      <Typography variant="h3" color="error">
        403
      </Typography>

      <Typography variant="h5">Accès refusé</Typography>

      <Typography>Vous n'avez pas les permissions nécessaires.</Typography>

      <Button variant="contained" onClick={() => navigate("/")}>
        Retour à l'accueil
      </Button>
    </Box>
  );
}

export default AccesRefuse;
