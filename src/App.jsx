import { useState } from "react";
import "./App.css";
import Register from "./components/Register";
import Login from "./components/Login";
import ClientManagement from "./components/ClientManagment";
import Products from "./components/Products";
import Clients2 from "./components/Clients2";
import AjoutFormilaire from "./components/AjoutClient";
import AjoutClient from "./components/AjoutClient";

function App() {
  return (
    <>
      <Register />
      <Login />
      {/* <ClientManagement />
      <Products />  */}
      <Clients2 />
      <Products />
    </>
  );
}

export default App;
