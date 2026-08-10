import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { Box, Typography, TextField, Button, Alert } from "@mui/material";

const loginSchema = yup.object({
  email: yup
    .string()
    .email("Format d'email invalide")
    .required("L'email est obligatoire"),
  password: yup
    .string()
    .required("Le mot de passe est obligatoire")
    .min(6, "Le mot de passe doit contenir au moins 6 caractÃ¨res"),
});

function Login() {
  const { login, error } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    const success = await login(data);
    if (success) {
      reset();
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f7f9fb",
        p: 2,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 420,
          bgcolor: "white",
          borderRadius: 2,
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12)",
          p: 4,
        }}
      >
        <Typography variant="h5" fontWeight={700} textAlign="center" sx={{ mb: 1 }}>
          Connexion
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Email"
              type="email"
              size="small"
              fullWidth
              error={!!errors.email}
              helperText={errors.email?.message}
              {...register("email")}
            />
            <TextField
              label="Mot de passe"
              type="password"
              size="small"
              fullWidth
              error={!!errors.password}
              helperText={errors.password?.message}
              {...register("password")}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              sx={{ bgcolor: "#004ac6", "&:hover": { bgcolor: "#003ea8" } }}
            >
              {isSubmitting ? "Connexion en cours..." : "Se connecter"}
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
}

export default Login;
