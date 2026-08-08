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

export default function Clients2() {
  const [clients, setClients] = useState([]);
  const [erreur, setErreur] = useState(null);
  useEffect(() => {
    clientApi
      .getAll()
      .then((data) => setClients(data))

      .catch((err) => setErreur(err.message));
  });
  //   console.log(data);

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Nom</th>
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
              <td>{c.email}</td>
              <td>{c.telephone}</td>
              <td>{c.ville}</td>
              <td>
                <button onClick={handleEdit(client)}>Modifier</button>
                <button>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
