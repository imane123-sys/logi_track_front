import React, { useEffect, useState } from "react";
import { clientApi } from "../../Api/ClientApi";

export default function ModifierClient({ client, setClient }) {
  const [erreur, setErreur] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    clientApi
      .update(client.id, client)
      .then((data) => {
        setClient(data);
        setClient(null);
      })
      .catch((err) => setErreur(err));
  };

  return (
    <div>
      <form action="" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="">Nom:</label>
          <input
            type="text"
            name="nom"
            value={client.nom}
            onChange={(e) => setClient({ ...client, nom: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="">Prenom:</label>
          <input
            type="text"
            name="prenom"
            value={client.prenom}
            onChange={(e) => setClient({ ...client, prenom: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="">Email</label>
          <input
            type="email"
            name="email"
            value={client.email}
            onChange={(e) => setClient({ ...client, email: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="">Téléphone</label>
          <input
            type="telephone"
            value={client.telephone}
            name="telephone"
            onChange={(e) =>
              setClient({ ...client, telephone: e.target.value })
            }
          />
        </div>
        <div>
          <label htmlFor="">Ville</label>
          <input
            type="text"
            value={client.ville}
            name="ville"
            onChange={(e) => setClient({ ...client, ville: e.target.value })}
          />
        </div>
        <div>
          <input type="submit" />
        </div>
      </form>
    </div>
  );
}
