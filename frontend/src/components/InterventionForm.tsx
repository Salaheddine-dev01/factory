import React, { useState, useEffect } from 'react';
import { Intervention } from '../api/interventions';

interface FormProps {
  mode: 'quick' | 'full';
  onAdd: (newIntervention: Intervention) => void;
  onEdit: (id: number, updates: Intervention) => void;
  editingIntervention?: Intervention | null;
}

const InterventionForm: React.FC<FormProps> = ({
  mode,
  onAdd,
  onEdit,
  editingIntervention
}) => {
  const [formData, setFormData] = useState<Partial<Intervention>>({});

  useEffect(() => {
    if (editingIntervention) {
      setFormData(editingIntervention);
    } else {
      setFormData({});
    }
  }, [editingIntervention]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (editingIntervention && editingIntervention.id) {
      const { id, ...updates } = formData as Intervention;
      onEdit(editingIntervention.id, updates as Intervention);
    } else {
      onAdd(formData as Intervention);
    }
    setFormData({});
  };

  const quickFields = [
    { label: 'Date', name: 'date', type: 'date' },
    { label: 'Chaine', name: 'chaine', type: 'text' },
    { label: 'Equipement', name: 'equipement', type: 'text' },
    { label: 'Référence', name: 'reference', type: 'text' },
    { label: 'Symptôme', name: 'symptome', type: 'text' },
    { label: 'Mécanicien', name: 'mecanicien', type: 'text' },
    { label: 'Heure de panne', name: 'heure_panne', type: 'time' },
    { label: 'Heure début', name: 'heure_debut', type: 'time' },
    { label: 'Heure fin', name: 'heure_fin', type: 'time' },
  ];

  const fullFields = [
    'pilote_rmec','type','service_demandeur','date','chaine','equipement','reference',
    'symptome','intervention_demandee','heure_panne','heure_debut','heure_fin','diagnostic','causes','travaux',
    'pieces_rechange','quantite','mecanicien','fin_intervention','nature_panne',
    'tps_reponse','duree_intervention','disponibilite','prestataire','date_commande',
    'date_livraison','prix_unitaire','cout_total','efficacite'
  ];

  const fieldsToRender = mode === 'quick' ? quickFields : fullFields;

  return (
    <div className="form-container">
      <h3>{editingIntervention ? 'Edit Intervention' : 'Add Intervention'} ({mode})</h3>

      <div className="form-grid">
        {fieldsToRender.map((field: any) => (
          <div key={field.name || field} className="form-field">
            <label>{typeof field === 'string' ? field : field.label}</label>
            <input
              type={typeof field === 'string' ? 'text' : field.type || 'text'}
              name={typeof field === 'string' ? field : field.name}
              value={(formData as any)[typeof field === 'string' ? field : field.name] || ''}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>
        ))}
      </div>

      <button onClick={handleSubmit}>
        {editingIntervention ? 'Save Changes' : 'Submit'}
      </button>

      <style>{`
        .form-container { border:1px solid #ccc; padding:15px; border-radius:6px; background:#f9f9f9; font-family:Arial,sans-serif; }
        .form-grid { display:grid; grid-template-columns: repeat(auto-fit,minmax(180px,1fr)); gap:12px; }
        .form-field { display:flex; flex-direction:column; }
        .form-field input { padding:6px; border-radius:4px; border:1px solid #ccc; font-size:14px; }
        .form-field label { font-size:12px; margin-bottom:4px; }
        button { margin-top:15px; padding:8px 16px; background-color:#007bff; color:#fff; border:none; border-radius:4px; cursor:pointer; font-weight:bold; }
      `}</style>
    </div>
  );
};

export default InterventionForm;
