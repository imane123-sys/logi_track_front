import { createContext, useEffect, useState } from "react";
import { clientApi } from "../../Api/ClientApi";
export const ClientContext = createContext();

export function ClientProvider({ children }) {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchClients = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await clientApi.getAll();
      const data = response || [];
      setClients(data);
      console.log(clients);
      
      
    } catch (err) {
      console.error("Error fetching clients:", err);
      setError(err?.response?.data?.message || "Failed to load clients.");
    } finally {
      setLoading(false);
    }
  };

  const addClient = async (clientData) => {
    setLoading(true);
    setError(null);
    try {
      await clientApi.create(clientData);
      await fetchClients(); 
      return true;
    } catch (err) {
      console.error("Error adding client:", err);
      setError(err?.response?.data?.message || "Failed to add client.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteClient = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await clientApi.delete(id);
      setClients((prev) => prev.filter((c) => c.id !== id));
      return true;
    } catch (err) {
      console.error("Error deleting client:", err);
      setError(err?.response?.data?.message || "Failed to delete client.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateClient = async (id, clientData) => {
    setLoading(true);
    setError(null);
    try {
      await clientApi.update(id, clientData);
      await fetchClients();
      return true;
    } catch (err) {
      console.error("Error updating client:", err);
      setError(err?.response?.data?.message || "Failed to update client.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <ClientContext.Provider
      value={{
        clients,
        loading,
        error,
        fetchClients,
        addClient,
        updateClient,
        deleteClient,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
}

export default ClientProvider;