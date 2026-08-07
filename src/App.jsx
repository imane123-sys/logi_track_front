import { useState } from "react";
import "./App.css";
import Register from "./components/Register";
import Login from "./components/Login";
import ClientManagement from "./components/ClientManagment";
import Products from "./components/Products";

function App() {
  return (
    <>
      <Register />
      <Login />
      <ClientManagement />
      <Products />
    </>
  );
}

export default App;
