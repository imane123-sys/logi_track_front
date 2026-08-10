import { Route, Routes } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Products from "./components/Products";
import Clients2 from "./components/Clients2";
import Orders from "./components/Orders";
import OrderDetails from "./components/OrderDetails";
import OrdersByClient from "./components/OrdersByClient";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Clients2 />} />
      <Route path="/clients" element={<Clients2 />} />
      <Route path="/produits" element={<Products />} />
      <Route path="/commandes" element={<Orders />} />
      <Route path="/commandes/client/:clientId" element={<OrdersByClient />} />
      <Route path="/commandes/:id" element={<OrderDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;
