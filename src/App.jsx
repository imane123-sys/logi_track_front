import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/acces-refuse" element={<AccessDenied />} />

      <Route
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "MANAGER", "AGENT"]} />
        }
      >
        <Route path="/" element={<Dashboard />} />

        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      <Route
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "MANAGER", "AGENT"]} />
        }
      >
        <Route path="/clients" element={<Clients2 />} />
      </Route>

      <Route
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "MANAGER", "AGENT"]} />
        }
      >
        <Route path="/produits" element={<Products />} />
      </Route>

      <Route
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "MANAGER", "AGENT"]} />
        }
      >
        <Route path="/commandes" element={<Orders />} />

        <Route
          path="/commandes/client/:clientId"
          element={<OrdersByClient />}
        />

        <Route path="/commandes/:id" element={<OrderDetails />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
        <Route path="/users" element={<Users />} />
      </Route>

      {/* <Route element={<ProtectedRoute allowedRoles={["ADMIN", "MANAGER"]} />}>
        <Route path="/statistiques" element={<Statistiques />} />
      </Route> */}
    </Routes>
  );
}

export default App;
