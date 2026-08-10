import React, { useState } from "react";
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
    <div className="bg-surface border border-outline-variant rounded-xl shadow-sm p-lg">
      {erreur && (
        <div className="mb-md flex items-center gap-2 px-4 py-3 rounded-lg bg-error-container text-on-error-container font-body-md text-body-md">
          <span className="material-symbols-outlined text-sm" data-icon="error">
            error
          </span>
          {String(erreur)}
        </div>
      )}
      <form action="" onSubmit={handleSubmit} className="space-y-md">
        <div>
          <label
            htmlFor=""
            className="block text-label-md font-label-md text-on-surface-variant mb-sm"
          >
            Nom:
          </label>
          <input
            type="text"
            name="nom"
            value={client.nom}
            onChange={(e) => setClient({ ...client, nom: e.target.value })}
            className="w-full bg-background border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:ring-2 focus:ring-primary focus:border-primary transition-all"
          />
        </div>
        <div>
          <label
            htmlFor=""
            className="block text-label-md font-label-md text-on-surface-variant mb-sm"
          >
            Prenom:
          </label>
          <input
            type="text"
            name="prenom"
            value={client.prenom}
            onChange={(e) => setClient({ ...client, prenom: e.target.value })}
            className="w-full bg-background border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:ring-2 focus:ring-primary focus:border-primary transition-all"
          />
        </div>
        <div>
          <label
            htmlFor=""
            className="block text-label-md font-label-md text-on-surface-variant mb-sm"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            value={client.email}
            onChange={(e) => setClient({ ...client, email: e.target.value })}
            className="w-full bg-background border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:ring-2 focus:ring-primary focus:border-primary transition-all"
          />
        </div>
        <div>
          <label
            htmlFor=""
            className="block text-label-md font-label-md text-on-surface-variant mb-sm"
          >
            Téléphone
          </label>
          <input
            type="telephone"
            value={client.telephone}
            name="telephone"
            onChange={(e) =>
              setClient({ ...client, telephone: e.target.value })
            }
            className="w-full bg-background border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:ring-2 focus:ring-primary focus:border-primary transition-all"
          />
        </div>
        <div>
          <label
            htmlFor=""
            className="block text-label-md font-label-md text-on-surface-variant mb-sm"
          >
            Ville
          </label>
          <input
            type="text"
            value={client.ville}
            name="ville"
            onChange={(e) => setClient({ ...client, ville: e.target.value })}
            className="w-full bg-background border border-outline-variant rounded-lg px-3 py-2 text-body-md focus:ring-2 focus:ring-primary focus:border-primary transition-all"
          />
        </div>
        <div>
          <input
            type="submit"
            className="px-4 py-2 bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:bg-primary/90 transition-colors shadow-sm cursor-pointer"
          />
        </div>
      </form>
    </div>
  );
}
