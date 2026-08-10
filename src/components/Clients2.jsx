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
import ClientDetails from "./ClientDetails";

export default function Clients2() {
  const [clients, setClients] = useState([]);
  const [client, setClient] = useState();
  const [erreur, setErreur] = useState(null);
  const [showAjoutClient, setShowAjoutClient] = useState(false);
  const [searchWord, setSearchWord] = useState("");
  const [showClientDetail, setSHowClientDetail] = useState(false);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);
  const [clientDetail, setClientDetail] = useState({});
  useEffect(() => {
    clientApi
      .getAll()
      .then((data) => {
        setClients(data);
      })

      .catch((err) => setErreur(err.message));
  }, [clients]);
  //   console.log(data);

  const handleDelete = (id) => {
    if (!Window.confirm("voulez vous supprimer ce message")) {
      return;
    }
    clientApi
      .delete(id)
      .then(() =>
        setClients((prevClienst) => prevClienst.filter((c) => c.id !== id)),
      )
      .catch((err) => setErreur(err.message));
  };
  const handleSearch = (nom) => {
    if (nom === "") {
      clientApi.getAll().then((data) => {
        setClients(data);
      });
    }
    clientApi
      .getClientByNom(nom)
      .then((data) => {
        setClients(data);
      })
      .catch((err) => setErreur(err.message));
  };
  useEffect(() => {
    clientApi
      .getClientsPaginated(page, size)
      .then((data) => setClients(data))
      .catch((err) => setErreur(err.message));
  }, [page, size]);

  const handleDetail = (id) => {
    clientApi
      .getById(id)

      .then((data) => {
        setSHowClientDetail(true);
        setClientDetail(data);
      })
      .catch((err) => setErreur(err.message));
  };

  return (
    <>
      <button onClick={() => setShowAjoutClient(true)}>Ajouter</button>
      <input
        type="search"
        placeholder="rechercher par nom"
        name="nom"
        value={searchWord}
        onChange={(e) => {
          const value = e.target.value;
          setSearchWord(value);
          handleSearch(value);
        }}
      />

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
                <button onClick={() => handleDelete(c.id)}>Supprimer</button>
                <button onClick={() => handleDetail(c.id)}>Voir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {client && <ModifierClient client={client} setClient={setClient} />}
      {showAjoutClient && (
        <AjoutClient setShowAjoutClient={setShowAjoutClient} />
      )}
      {showClientDetail && (
        <ClientDetails
          clientDetail={clientDetail}
          setSHowClientDetail={setSHowClientDetail}
        />
      )}
      <Button onClick={() => setPage(page - 1)}>Précédent</Button>
      <Button onClick={() => setPage(page + 1)}>Suivant</Button>
    </>
  );
}
