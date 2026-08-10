import React from "react";
import { clientApi } from "../../Api/ClientApi";

export default function ClientDetails({ clientDetail, setSHowClientDetail }) {
  return (
    <>
      <h1>les détails d'un client:</h1>
      <div>
        <p>ID:{clientDetail.id}</p>
        <p>Nom:{clientDetail.nom}</p>
        <p>Prenom:{clientDetail.prenom}</p>
        <p>Email:{clientDetail.email}</p>
        <p>Telephone:{clientDetail.telephone}</p>
        <p>Ville:{clientDetail.ville}</p>
      </div>
      <button onClick={() => setSHowClientDetail(false)}>Fermer</button>
    </>
  );
}
