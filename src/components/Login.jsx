import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../Api/AuthContext";
import { login } from "../Api/AuthService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    // Envoi des arguments (email, password) séparés
    login(email, password)
      .then((response) => {
        console.log("Connexion réussie :", response);
        loginUser(response);
        navigate("/dashboard");
      })
      .catch((err) => {
        console.error("Erreur de connexion :", err);
        setError(
          err.message ||
            err.response?.data?.message ||
            "Identifiants incorrects.",
        );
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>HealthCare+</h2>
        <p style={styles.subtitle}>
          Connexion à l'espace sécurisé de la clinique
        </p>

        {error && <div style={styles.errorAlert}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="Ex: email@gmail.com"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Mot de passe</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={
              isSubmitting
                ? { ...styles.button, opacity: 0.7, cursor: "not-allowed" }
                : styles.button
            }
          >
            {isSubmitting ? "Connexion en cours..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f0f4f8",
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    padding: "2.5rem",
    borderRadius: "8px",
    backgroundColor: "#ffffff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },
  title: {
    textAlign: "center",
    color: "#0056b3",
    marginBottom: "0.5rem",
    fontSize: "2rem",
    fontWeight: "700",
  },
  subtitle: {
    textAlign: "center",
    color: "#6c757d",
    marginBottom: "2rem",
    fontSize: "0.95rem",
  },
  inputGroup: { marginBottom: "1.5rem" },
  label: {
    display: "block",
    marginBottom: "0.5rem",
    color: "#495057",
    fontSize: "0.9rem",
    fontWeight: "500",
  },
  input: {
    width: "100%",
    padding: "0.75rem",
    borderRadius: "4px",
    border: "1px solid #ced4da",
    fontSize: "1rem",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "0.75rem",
    border: "none",
    borderRadius: "4px",
    backgroundColor: "#0056b3",
    color: "#fff",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
  },
  errorAlert: {
    padding: "0.75rem",
    marginBottom: "1.5rem",
    backgroundColor: "#f8d7da",
    color: "#721c24",
    border: "1px solid #f5c6cb",
    borderRadius: "4px",
    fontSize: "0.9rem",
  },
};

export default Login;
