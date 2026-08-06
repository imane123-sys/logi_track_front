import React, { useState, useContext } from "react";
import { ClientContext } from "./ClientContext";

export default function ClientManagement({ canDelete = true }) {
  const { clients, loading, error, addClient, deleteClient } =
    useContext(ClientContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  // Added 'prenom' to form state to match Spring Boot User entity
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    ville: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await addClient(formData);
    if (success) {
      setFormData({ nom: "", prenom: "", email: "", telephone: "", ville: "" });
      setShowAddModal(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) {
      await deleteClient(id);
    }
  };

  // Updated to also search by prenom
  const filteredClients = (clients || []).filter(
    (c) =>
      c.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.ville?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Gestion des Clients
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Gérez vos clients, consultez leurs détails et ajoutez de nouvelles
            entrées.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          + Nouveau Client
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Search & Counter */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Rechercher par nom, prénom, email, ville..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all"
          />
        </div>
        <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
          Total: {filteredClients.length}
        </span>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500 text-sm">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-indigo-600 border-t-transparent mb-2"></div>
            <p>Chargement des clients...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs text-gray-700 uppercase font-semibold border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3.5">ID</th>
                  <th className="px-6 py-3.5">Nom</th>
                  <th className="px-6 py-3.5">Prénom</th>
                  <th className="px-6 py-3.5">Email</th>
                  <th className="px-6 py-3.5">Téléphone</th>
                  <th className="px-6 py-3.5">Ville</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredClients.length > 0 ? (
                  filteredClients.map((client) => (
                    <tr
                      key={client.id}
                      className="hover:bg-gray-50/80 transition-colors"
                    >
                      <td className="px-6 py-4 font-mono text-xs text-gray-500">
                        #{client.id}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {client.nom}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {client.prenom}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {client.email}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {client.telephone}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {client.ville}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => setSelectedClient(client)}
                          className="inline-flex items-center text-xs font-medium text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-2.5 py-1 rounded transition-colors cursor-pointer"
                        >
                          Voir
                        </button>
                        {canDelete && (
                          <button
                            onClick={() => handleDelete(client.id)}
                            className="inline-flex items-center text-xs font-medium text-red-600 hover:text-red-800 hover:bg-red-50 px-2.5 py-1 rounded transition-colors cursor-pointer"
                          >
                            Supprimer
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-12 text-center text-gray-400"
                    >
                      Aucun client trouvé.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL 1: Voir Détails Client */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Détails du Client #{selectedClient.id}
              </h3>
              <button
                onClick={() => setSelectedClient(null)}
                className="text-gray-400 hover:text-gray-600 text-xl font-medium cursor-pointer"
              >
                &times;
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="block text-xs font-semibold text-gray-400 uppercase">
                    Nom
                  </span>
                  <span className="font-medium text-gray-900">
                    {selectedClient.nom}
                  </span>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-gray-400 uppercase">
                    Prénom
                  </span>
                  <span className="font-medium text-gray-900">
                    {selectedClient.prenom}
                  </span>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-gray-400 uppercase">
                    Email
                  </span>
                  <span className="text-gray-700">{selectedClient.email}</span>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-gray-400 uppercase">
                    Téléphone
                  </span>
                  <span className="text-gray-700">
                    {selectedClient.telephone}
                  </span>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-gray-400 uppercase">
                    Ville
                  </span>
                  <span className="text-gray-700">{selectedClient.ville}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">
                  Commandes associées
                </h4>
                {selectedClient.commandes &&
                selectedClient.commandes.length > 0 ? (
                  <ul className="divide-y divide-gray-100 max-h-40 overflow-y-auto">
                    {selectedClient.commandes.map((cmd) => (
                      <li
                        key={cmd.id}
                        className="py-2 text-xs flex justify-between"
                      >
                        <span>Commande #{cmd.id}</span>
                        <span className="text-gray-500">
                          {cmd.statut || "En cours"}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-gray-400">
                    Aucune commande enregistrée pour ce client.
                  </p>
                )}
              </div>
            </div>
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setSelectedClient(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Ajouter un Client */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Ajouter un Client
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-medium cursor-pointer"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Nom
                  </label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    required
                    placeholder="ex: Dupont"
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                    Prénom
                  </label>
                  <input
                    type="text"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleChange}
                    required
                    placeholder="ex: Jean"
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="ex: jean.dupont@example.com"
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Téléphone
                </label>
                <input
                  type="text"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  required
                  placeholder="ex: 0612345678"
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Ville
                </label>
                <input
                  type="text"
                  name="ville"
                  value={formData.ville}
                  onChange={handleChange}
                  required
                  placeholder="ex: Paris"
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg transition-colors cursor-pointer"
                >
                  {loading ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}