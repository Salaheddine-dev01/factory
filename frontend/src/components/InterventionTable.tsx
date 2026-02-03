// src/components/InterventionTable.tsx
import React from 'react';
import { Intervention } from '../api/interventions';

interface TableProps {
  interventions: Intervention[];
  onEdit: (intervention: Intervention) => void;
  onDelete: (id: number) => void;
}

const columns: (keyof Intervention)[] = [
  'id','pilote_rmec','type','service_demandeur','date','chaine','equipement','reference',
  'symptome','intervention_demandee','heure_panne','heure_debut','heure_fin','diagnostic','causes','travaux',
  'pieces_rechange','quantite','mecanicien','fin_intervention','nature_panne',
  'tps_reponse','duree_intervention','disponibilite'
];

const InterventionTable: React.FC<TableProps> = ({ interventions, onEdit, onDelete }) => {
  const handleDelete = (id: number | undefined | null) => {
    if (!id) {
      alert('Invalid intervention ID');
      return;
    }
    if (window.confirm('Are you sure you want to delete this intervention?')) {
      onDelete(id);
    }
  };

  if (interventions.length === 0) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center', 
        border: '1px solid #ccc', 
        borderRadius: '6px',
        background: '#f9f9f9' 
      }}>
        <p style={{ fontSize: '16px', color: '#666' }}>No interventions found. Add one using the form above!</p>
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto', border: '1px solid #ccc', borderRadius: '6px', maxWidth: '100%' }}>
      <table style={{
        borderCollapse: 'collapse',
        width: '100%',
        minWidth: '1400px',
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px'
      }}>
        <thead>
          <tr style={{ background: '#007bff', color: 'white', position: 'sticky', top: 0, zIndex: 5 }}>
            <th style={{ border: '1px solid #ccc', padding: '6px 8px', textAlign: 'center', whiteSpace: 'nowrap' }}>
              Actions
            </th>
            {columns.map(col => (
              <th key={String(col)} style={{ border: '1px solid #ccc', padding: '6px 8px', textAlign: 'left', whiteSpace: 'nowrap' }}>
                {String(col)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {interventions.map((interv, idx) => (
            <tr key={interv.id || idx} style={{ background: idx % 2 === 0 ? '#fff' : '#f9f9f9' }}>
              <td style={{ border: '1px solid #ccc', padding: '6px 8px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                <button
                  onClick={() => onEdit(interv)}
                  style={{
                    padding: '4px 8px',
                    marginRight: '4px',
                    background: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(interv.id)}
                  style={{
                    padding: '4px 8px',
                    background: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Delete
                </button>
              </td>
              {columns.map(col => (
                <td key={String(col)} style={{ border: '1px solid #ccc', padding: '6px 8px', whiteSpace: 'nowrap' }}>
                  {(interv[col] as any) ?? ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InterventionTable;