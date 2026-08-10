import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { register as registerApi } from "../../Api/AuthService";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { Box, Typography, TextField, Button, Alert, MenuItem } from "@mui/material";

const registerSchema = yup.object().shape({
  nom: yup
    .string()
    .required("Le nom est obligatoire")
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(50, "Le nom ne peut pas dépasser 50 caractères"),

  prenom: yup
    .string()
    .required("Le prénom est obligatoire")
    .min(2, "Le prénom doit contenir au moins 2 caractères")
    .max(50, "Le prénom ne peut pas dépasser 50 caractères"),

  email: yup
    .string()
    .required("L'email est obligatoire")
    .email("Le format de l'email est invalide"),

  password: yup
    .string()
    .required("Le mot de passe est obligatoire")
    .min(6, "Le mot de passe doit contenir au moins 6 caractères"),

  role: yup
    .string()
    .required("Le rôle est obligatoire")
    .oneOf(["ADMIN", "MANAGER", "AGENT"], "Rôle invalide"),
});

function Register() {
  const [apiError, setApiError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const { login, error, token } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      nom: "",
      prenom: "",
      email: "",
      password: "",
      role: "AGENT",
    },
  });

  const onSubmit = async (data) => {
    setApiError(null);
    setSuccessMessage(null);

    try {
      await registerApi(
        data.nom,
        data.prenom,
        data.email,
        data.password,
        data.role,
      );
      setSuccessMessage("Inscription réussie !");
      reset();
    } catch (err) {
      setApiError(
        err?.response?.data?.message ||
          err?.message ||
          "Erreur lors de l'inscription.",
      );
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
          maxWidth: 460,
          bgcolor: "white",
          borderRadius: 2,
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12)",
          p: 4,
        }}
      >
        <Typography variant="h5" fontWeight={700} textAlign="center" sx={{ mb: 1 }}>
          Inscription
        </Typography>

        {apiError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {apiError}
          </Alert>
        )}
        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Nom"
              size="small"
              fullWidth
              error={!!errors.nom}
              helperText={errors.nom?.message}
              {...register("nom")}
            />
            <TextField
              label="Prénom"
              size="small"
              fullWidth
              error={!!errors.prenom}
              helperText={errors.prenom?.message}
              {...register("prenom")}
            />
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
            <TextField
              label="Rôle"
              select
              size="small"
              fullWidth
              error={!!errors.role}
              helperText={errors.role?.message}
              {...register("role")}
            >
              <MenuItem value="AGENT">AGENT</MenuItem>
              <MenuItem value="MANAGER">MANAGER</MenuItem>
              <MenuItem value="ADMIN">ADMIN</MenuItem>
            </TextField>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              sx={{ bgcolor: "#004ac6", "&:hover": { bgcolor: "#003ea8" } }}
            >
              {isSubmitting ? "Inscription en cours..." : "S'inscrire"}
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
}

export default Register;
