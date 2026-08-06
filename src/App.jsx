import { useState } from "react";
import "./App.css";
import Register from "./components/Register";
import Login from "./components/Login";
import ClientManagement from "./components/ClientManagment";

function App() {
  return (
    <>
      <Register />
      <Login />
      <ClientManagement />
    </>
  );
}

export default App;
