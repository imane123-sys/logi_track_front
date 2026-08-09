import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Chip,
  Alert,
  Dialog,
} from "@mui/material";
import { clientApi } from "../../Api/ClientApi";
import ModifierClient from "./ModifierClient";
import AjoutClient from "./AjoutClient";

export default function Clients2() {
  const [clients, setClients] = useState([]);
  const [client, setClient] = useState();
  const [erreur, setErreur] = useState(null);
  const [showAjoutClient, setShowAjoutClient] = useState(false);
  useEffect(() => {
    clientApi
      .getAll()
      .then((data) => setClients(data))

      .catch((err) => setErreur(err.message));
  }, [client]);
  //   console.log(data);

  return (
    <>
      <button onClick={() => setShowAjoutClient(true)}>Ajouter</button>

      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Prenom</th>
            <th>Email</th>
            <th>Téléphone</th>
            <th>Ville</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((c) => (
            <tr key={c.id}>
              <td>{c.nom}</td>
              <td>{c.prenom}</td>

              <td>{c.email}</td>
              <td>{c.telephone}</td>
              <td>{c.ville}</td>
              <td>
                <button onClick={() => setClient(c)}>Modifier</button>
                <button>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {client && <ModifierClient client={client} setClient={setClient} />}
      {showAjoutClient && <AjoutClient />}
    </>
  );
}
