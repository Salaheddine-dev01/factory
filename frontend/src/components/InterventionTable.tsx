import React from 'react';
import { Intervention } from '../api/interventions';

interface TableProps {
  interventions: Intervention[];
  onEdit: (intervention: Intervention) => void;
  onDelete: (id: number) => void;
}

const columns = [
  'pilote_rmec','type','service_demandeur','date','chaine','equipement','reference',
  'symptome','intervention_demandee','heure_panne','heure_debut','heure_fin','diagnostic','causes','travaux',
  'pieces_rechange','quantite','mecanicien','fin_intervention','nature_panne',
  'tps_reponse','duree_intervention','disponibilite','prestataire','date_commande',
  'date_livraison','prix_unitaire','cout_total','efficacite'
];

const InterventionTable: React.FC<TableProps> = ({ interventions, onEdit, onDelete }) => {
  return (
    <div className="table-container">
      <table className="intervention-table">
        <thead>
          <tr>
            {columns.map(col => <th key={col}>{col}</th>)}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {interventions.map(interv => (
            <tr key={interv.id}>
              {columns.map(col => <td key={col}>{(interv as any)[col] || ''}</td>)}
              <td>
                <button onClick={() => onEdit(interv)} style={{ marginRight: '5px' }}>
                  Edit
                </button>
                <button onClick={() => interv.id && onDelete(interv.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <style>{`
        .table-container { overflow-x:auto; border:1px solid #ccc; border-radius:6px; max-width:100%; }
        .intervention-table { border-collapse:collapse; width:100%; min-width:1400px; font-family:Arial,sans-serif; font-size:14px; }
        .intervention-table th,.intervention-table td { border:1px solid #ccc; padding:6px 8px; text-align:left; white-space:nowrap; }
        .intervention-table th { background:#007bff; color:white; position:sticky; top:0; z-index:5; }
        .intervention-table tbody tr:nth-child(even){ background:#f2f2f2; }
        .intervention-table tbody tr:hover { background:#d1e7ff; }
        button { padding:3px 6px; border:none; border-radius:3px; cursor:pointer; }
        button:hover { opacity:0.8; }
      `}</style>
    </div>
  );
};

export default InterventionTable;
