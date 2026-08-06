import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { register as registerApi } from "../../Api/AuthService";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";
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
    <div className="max-w-md mx-auto my-8 p-6 bg-white border border-gray-200 rounded-lg shadow-sm space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 text-center">
        Inscription
      </h2>

      {apiError && (
        <p className="p-2 bg-red-50 text-red-600 text-sm rounded border border-red-200">
          {apiError}
        </p>
      )}
      {successMessage && (
        <p className="p-2 bg-green-50 text-green-600 text-sm rounded border border-green-200">
          {successMessage}
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="nom"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nom
          </label>
          <input
            id="nom"
            type="text"
            {...register("nom")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          {errors.nom && (
            <p className="text-red-500 text-sm mt-1">{errors.nom.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="prenom"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Prénom
          </label>
          <input
            id="prenom"
            type="text"
            {...register("prenom")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          {errors.prenom && (
            <p className="text-red-500 text-sm mt-1">{errors.prenom.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            {...register("password")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="role"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Rôle
          </label>
          <select
            id="role"
            {...register("role")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
          >
            <option value="AGENT">AGENT</option>
            <option value="MANAGER">MANAGER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
          {errors.role && (
            <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Inscription en cours..." : "S'inscrire"}
        </button>
      </form>
    </div>
  );
}

export default Register;
