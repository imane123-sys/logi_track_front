import React from "react";

export default function ClientDetails({ clientDetail, setSHowClientDetail }) {
  return (
    <div className="bg-surface border border-outline-variant rounded-xl shadow-sm p-lg space-y-md">
      <h1 className="font-headline-lg text-headline-lg text-on-surface">
        les détails d'un client:
      </h1>
      <div className="space-y-sm">
        <p className="text-body-md text-on-surface">
          <span className="text-label-md font-label-md text-on-surface-variant">
            ID:
          </span>{" "}
          {clientDetail.id}
        </p>
        <p className="text-body-md text-on-surface">
          <span className="text-label-md font-label-md text-on-surface-variant">
            Nom:
          </span>{" "}
          {clientDetail.nom}
        </p>
        <p className="text-body-md text-on-surface">
          <span className="text-label-md font-label-md text-on-surface-variant">
            Prenom:
          </span>{" "}
          {clientDetail.prenom}
        </p>
        <p className="text-body-md text-on-surface">
          <span className="text-label-md font-label-md text-on-surface-variant">
            Email:
          </span>{" "}
          {clientDetail.email}
        </p>
        <p className="text-body-md text-on-surface">
          <span className="text-label-md font-label-md text-on-surface-variant">
            Telephone:
          </span>{" "}
          {clientDetail.telephone}
        </p>
        <p className="text-body-md text-on-surface">
          <span className="text-label-md font-label-md text-on-surface-variant">
            Ville:
          </span>{" "}
          {clientDetail.ville}
        </p>
      </div>
      <button
        onClick={() => setSHowClientDetail(false)}
        className="px-4 py-2 bg-surface border border-outline-variant rounded-lg text-on-surface font-label-md text-label-md hover:bg-surface-container-low transition-colors"
      >
        Fermer
      </button>
    </div>
  );
}
