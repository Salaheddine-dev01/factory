// src/components/InterventionForm.tsx
import React, { useState, useEffect } from 'react';
import { Intervention } from '../api/interventions';

interface FormProps {
  mode: 'quick' | 'full';
  onAdd: (newIntervention: Intervention) => void;
  onUpdate: (id: number, updates: Intervention) => void;
  editingIntervention: Intervention | null;
  onCancelEdit: () => void;
}

const InterventionForm: React.FC<FormProps> = ({ mode, onAdd, onUpdate, editingIntervention, onCancelEdit }) => {
  const [formData, setFormData] = useState<Partial<Intervention>>({});

  // Populate form when editing
  useEffect(() => {
    if (editingIntervention) {
      setFormData(editingIntervention);
    }
  }, [editingIntervention]);

  // Calculate time difference in minutes
  const calculateTimeDiff = (startTime: string, endTime: string): number | null => {
    if (!startTime || !endTime) return null;
    
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    const startTotalMin = startHour * 60 + startMin;
    const endTotalMin = endHour * 60 + endMin;
    
    return endTotalMin - startTotalMin;
  };

  // Auto-calculate fields when relevant inputs change
  useEffect(() => {
    const updates: Partial<Intervention> = {};

    // Calculate tps_reponse (response time)
    if (formData.heure_panne && formData.heure_debut) {
      const diff = calculateTimeDiff(formData.heure_panne, formData.heure_debut);
      if (diff !== null && diff >= 0) {
        updates.tps_reponse = diff.toString();
      }
    }

    // Calculate duree_intervention (intervention duration)
    if (formData.heure_debut && formData.heure_fin) {
      const diff = calculateTimeDiff(formData.heure_debut, formData.heure_fin);
      if (diff !== null && diff >= 0) {
        updates.duree_intervention = diff.toString();
      }
    }

    // Only update if there are changes
    if (Object.keys(updates).length > 0) {
      setFormData((prev: Partial<Intervention>) => ({ ...prev, ...updates }));
    }
  }, [
    formData.heure_panne, 
    formData.heure_debut, 
    formData.heure_fin
  ]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: Partial<Intervention>) => ({ ...prev, [name]: value }));
  };

  // Handle submit with proper data sanitization
  const handleSubmit = () => {
    const safeData: Record<string, any> = {};
    
    (Object.keys(formData) as (keyof Intervention)[]).forEach((key: keyof Intervention) => {
      const value = formData[key];
      
      // Handle empty values
      if (value === '' || value === undefined) {
        safeData[key] = null;
        return;
      }

      // Convert numeric fields properly
      if (['quantite', 'tps_reponse', 'duree_intervention'].includes(key)) {
        const numValue = parseFloat(value as string);
        safeData[key] = !isNaN(numValue) ? numValue : null;
      } else {
        safeData[key] = value;
      }
    });
    
    console.log('Data being sent to backend:', safeData);
    
    if (editingIntervention && editingIntervention.id) {
      onUpdate(editingIntervention.id, safeData as Intervention);
    } else {
      onAdd(safeData as Intervention);
    }
    
    setFormData({});
  };

  const handleCancel = () => {
    setFormData({});
    onCancelEdit();
  };

  // Function to get tooltip text based on field type
  const getTooltip = (field: any): string => {
    if (field.readonly) {
      return '🔄 Auto-calculated field (read-only)';
    }
    
    switch (field.type) {
      case 'date':
        return '📅 Date format: YYYY-MM-DD (e.g., 2024-01-15)';
      case 'time':
        return '⏰ Time format: HH:MM (e.g., 14:30)';
      case 'number':
        return '🔢 Number format: Enter numeric value (e.g., 123.45)';
      case 'text':
      default:
        return '✏️ Text field: Enter any text';
    }
  };

  // Quick mode fields
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
    { label: 'Temps réponse (min) 🔄', name: 'tps_reponse', type: 'number', readonly: true },
    { label: 'Durée intervention (min) 🔄', name: 'duree_intervention', type: 'number', readonly: true },
  ];

  // Full mode fields
  const fullFields = [
    { label: 'Pilote RMEC', name: 'pilote_rmec', type: 'text' },
    { label: 'Type', name: 'type', type: 'text' },
    { label: 'Service Demandeur', name: 'service_demandeur', type: 'text' },
    { label: 'Date', name: 'date', type: 'date' },
    { label: 'Chaine', name: 'chaine', type: 'text' },
    { label: 'Equipement', name: 'equipement', type: 'text' },
    { label: 'Référence', name: 'reference', type: 'text' },
    { label: 'Symptôme', name: 'symptome', type: 'text' },
    { label: 'Intervention Demandée', name: 'intervention_demandee', type: 'text' },
    { label: 'Heure de panne', name: 'heure_panne', type: 'time' },
    { label: 'Heure début', name: 'heure_debut', type: 'time' },
    { label: 'Heure fin', name: 'heure_fin', type: 'time' },
    { label: 'Diagnostic', name: 'diagnostic', type: 'text' },
    { label: 'Causes', name: 'causes', type: 'text' },
    { label: 'Travaux', name: 'travaux', type: 'text' },
    { label: 'Pièces de Rechange', name: 'pieces_rechange', type: 'text' },
    { label: 'Quantité', name: 'quantite', type: 'number' },
    { label: 'Mécanicien', name: 'mecanicien', type: 'text' },
    { label: 'Fin Intervention', name: 'fin_intervention', type: 'text' },
    { label: 'Nature Panne', name: 'nature_panne', type: 'text' },
    { label: 'Temps réponse (min) 🔄', name: 'tps_reponse', type: 'number', readonly: true },
    { label: 'Durée intervention (min) 🔄', name: 'duree_intervention', type: 'number', readonly: true },
    { label: 'Disponibilité', name: 'disponibilite', type: 'text' },
  ];

  const fieldsToRender = mode === 'quick' ? quickFields : fullFields;

  return (
    <div className="form-container">
      <h3>
        {editingIntervention ? `Edit Intervention #${editingIntervention.id}` : `Add Intervention (${mode})`}
      </h3>
      
      {editingIntervention && (
        <div style={{ padding: '8px', background: '#fff3cd', borderRadius: '4px', marginBottom: '10px' }}>
          <strong>Editing Mode:</strong> You are currently editing an existing intervention.
        </div>
      )}

      <div style={{ padding: '8px', background: '#d1ecf1', borderRadius: '4px', marginBottom: '10px', fontSize: '13px' }}>
        <strong>💡 Tip:</strong> Hover over any field to see its data type and format. Auto-calculated fields are marked with 🔄.
      </div>
      
      <div className="form-grid">
        {fieldsToRender.map((field: any) => (
          <div key={field.name} className="form-field">
            <label 
              title={getTooltip(field)}
              style={{ cursor: 'help' }}
            >
              {field.label}
            </label>
            <input
              type={field.type || 'text'}
              name={field.name}
              value={(formData as any)[field.name] || ''}
              onChange={handleChange}
              autoComplete="off"
              readOnly={field.readonly}
              title={getTooltip(field)}
              placeholder={
                field.type === 'date' ? 'YYYY-MM-DD' :
                field.type === 'time' ? 'HH:MM' :
                field.type === 'number' ? 'Enter number' :
                `Enter ${field.label.toLowerCase()}`
              }
              style={field.readonly ? { background: '#e9ecef', cursor: 'not-allowed' } : {}}
              step={field.type === 'number' ? '0.01' : undefined}
            />
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
        <button onClick={handleSubmit}>
          {editingIntervention ? 'Update' : 'Submit'}
        </button>
        
        {editingIntervention && (
          <button 
            onClick={handleCancel}
            style={{ background: '#6c757d' }}
          >
            Cancel
          </button>
        )}
      </div>

      <style>{`
        .form-container { border:1px solid #ccc; padding:15px; border-radius:6px; background:#f9f9f9; font-family:Arial,sans-serif; }
        .form-grid { display:grid; grid-template-columns: repeat(auto-fit,minmax(180px,1fr)); gap:12px; }
        .form-field { display:flex; flex-direction:column; }
        .form-field input { padding:6px; border-radius:4px; border:1px solid #ccc; font-size:14px; }
        .form-field label { font-size:12px; margin-bottom:4px; font-weight:bold; }
        button { padding:8px 16px; background-color:#007bff; color:#fff; border:none; border-radius:4px; cursor:pointer; font-weight:bold; }
        button:hover { background-color:#0056b3; }
      `}</style>
    </div>
  );
};

export default InterventionForm;