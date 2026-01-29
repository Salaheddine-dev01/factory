import React, { useState, useEffect } from 'react';
import InterventionForm from './components/InterventionForm';
import InterventionTable from './components/InterventionTable';
import Dashboard from './components/Dashboard';
import {
  getInterventions,
  addIntervention,
  editIntervention,
  deleteIntervention,
  Intervention
} from './api/interventions';

const App: React.FC = () => {
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [mode, setMode] = useState<'quick' | 'full'>('quick');
  const [editingIntervention, setEditingIntervention] = useState<Intervention | null>(null);

  const fetchInterventions = async () => {
    const data = await getInterventions();
    setInterventions(data);
  };

  useEffect(() => {
    fetchInterventions();
  }, []);

  const handleAdd = async (data: Intervention) => {
    const added = await addIntervention(data);
    setInterventions(prev => [...prev, added]);
  };

  const handleEdit = async (id: number, updates: Intervention) => {
    const updated = await editIntervention(id, updates);
    setInterventions(prev =>
      prev.map(i => (i.id === id ? updated : i))
    );
    setEditingIntervention(null);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this intervention?')) return;
    await deleteIntervention(id);
    setInterventions(prev => prev.filter(i => i.id !== id));
  };

  const modeButtonStyle = (active: boolean): React.CSSProperties => ({
    marginRight: '10px',
    padding: '8px 16px',
    backgroundColor: active ? '#007bff' : '#ddd',
    color: active ? '#fff' : '#000',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
  });

  return (
    <div className="App" style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>
        Factory Maintenance Tracker
      </h1>

      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <button onClick={() => setMode('quick')} style={modeButtonStyle(mode === 'quick')}>
          Quick Mode
        </button>
        <button onClick={() => setMode('full')} style={modeButtonStyle(mode === 'full')}>
          Full Mode
        </button>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <InterventionForm
          mode={mode}
          onAdd={handleAdd}
          onEdit={handleEdit}
          editingIntervention={editingIntervention}
        />
      </div>

      <div style={{ marginBottom: '40px' }}>
        <InterventionTable
          interventions={interventions}
          onEdit={setEditingIntervention}
          onDelete={handleDelete}
        />
      </div>

      <Dashboard interventions={interventions} />
    </div>
  );
};

export default App;
