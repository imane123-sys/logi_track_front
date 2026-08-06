import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

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
    <div className="max-w-md mx-auto my-8 p-6 bg-white border border-gray-200 rounded-lg shadow-sm space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 text-center">
        Connexion
      </h2>

      {error && (
        <p className="p-2 bg-red-50 text-red-600 text-sm rounded border border-red-200">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email :
          </label>
          <input
            type="email"
            id="email"
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
            Mot de passe :
          </label>
          <input
            type="password"
            id="password"
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
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Connexion en cours..." : "Se connecter"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
