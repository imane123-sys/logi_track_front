import React, { useEffect, useState } from "react";
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
  }, []);

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
    <div className="min-h-screen bg-background text-on-surface font-body-md text-body-md p-md md:p-lg">
      <div className="max-w-[1440px] mx-auto w-full space-y-lg">
        {/* Bouton Ajouter + Recherche */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-md">
          <button
            onClick={() => setShowAjoutClient(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:bg-primary/90 transition-colors shadow-sm self-start"
          >
            <span className="material-symbols-outlined text-sm" data-icon="add">
              add
            </span>
            Ajouter
          </button>
          <div className="relative w-full md:w-96">
            <span
              className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline"
              data-icon="search"
            >
              search
            </span>
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
              className="w-full bg-surface border border-outline-variant rounded-lg pl-10 pr-4 py-2 text-body-md focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            />
          </div>
        </div>

        {erreur && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-error-container text-on-error-container font-body-md text-body-md">
            <span
              className="material-symbols-outlined text-sm"
              data-icon="error"
            >
              error
            </span>
            {erreur}
          </div>
        )}

        {/* Tableau */}
        <div className="bg-surface border border-outline-variant rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container-low/50">
                  <th className="p-md font-label-md text-label-md text-on-surface-variant font-medium">
                    Nom
                  </th>
                  <th className="p-md font-label-md text-label-md text-on-surface-variant font-medium">
                    Prenom
                  </th>
                  <th className="p-md font-label-md text-label-md text-on-surface-variant font-medium">
                    Email
                  </th>
                  <th className="p-md font-label-md text-label-md text-on-surface-variant font-medium">
                    Téléphone
                  </th>
                  <th className="p-md font-label-md text-label-md text-on-surface-variant font-medium">
                    Ville
                  </th>
                  <th className="p-md font-label-md text-label-md text-on-surface-variant font-medium text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {clients.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-outline-variant/50 hover:bg-surface-container-low transition-colors"
                  >
                    <td className="p-md font-medium text-on-surface">
                      {c.nom}
                    </td>
                    <td className="p-md text-on-surface">{c.prenom}</td>
                    <td className="p-md text-on-surface-variant">{c.email}</td>
                    <td className="p-md text-on-surface-variant">
                      {c.telephone}
                    </td>
                    <td className="p-md text-on-surface-variant">{c.ville}</td>
                    <td className="p-md text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleDetail(c.id)}
                          className="px-2 py-1 rounded-lg bg-secondary-container text-on-secondary-container font-label-md text-label-md hover:bg-secondary-fixed transition-colors"
                        >
                          Voir
                        </button>
                        <button
                          onClick={() => setClient(c)}
                          className="px-2 py-1 rounded-lg bg-primary-container text-on-primary-container font-label-md text-label-md hover:bg-primary-fixed-dim transition-colors"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="px-2 py-1 rounded-lg bg-error-container text-on-error-container font-label-md text-label-md hover:bg-error/20 transition-colors"
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

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

        {/* Pagination */}
        <div className="flex items-center gap-sm justify-end">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 0}
            className="px-4 py-2 bg-surface border border-outline-variant rounded-lg text-on-surface font-label-md text-label-md hover:bg-surface-container-low transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Précédent
          </button>
          <button
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-surface border border-outline-variant rounded-lg text-on-surface font-label-md text-label-md hover:bg-surface-container-low transition-colors"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
}
