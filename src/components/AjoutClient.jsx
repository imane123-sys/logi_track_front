import React, { useEffect, useState } from "react";
import { clientApi } from "../../Api/ClientApi";

export default function AjoutClient() {
  const [clients, setClients] = useState([]);
  const [erreur, setErreur] = useState(null);
  const [change, setChange] = useState(null);

  const [client, setClient] = useState({
    nom: "",
    email: "",
    telephone: "",
    ville: "",
  });
  const handleSybmit = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    clientApi
      .create()
      .then((data) => setClients(data))
      .catch((err) => setErreur(err.message));
  }, []);

  useEffect(() => {
    clientApi
      .getAll()
      .then((data) => setClients(data))

      .catch((err) => setErreur(err.message));
  }, []);

  return (
    <>
      <form action="">
        <label htmlFor="">Nom:</label>
        <input
          type="text"
          name="nom"
          value={client.nom}
          onChange={(e) => setChange(e.target.value)}
        />
        <label htmlFor="">Email</label>
        <input
          type="email"
          name="email"
          value={client.email}
          onChange={(e) => setChange(e.target.value)}
        />
        <label htmlFor="">Téléphone</label>
        <input
          type="tel"
          value={client.telephone}
          name="telephone"
          onChange={(e) => setChange(e.target.value)}
        />
      </form>
    </>
  );
}
