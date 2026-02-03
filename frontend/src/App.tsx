// src/App.tsx
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import InterventionForm from './components/InterventionForm';
import InterventionTable from './components/InterventionTable';
import SearchFilter, { FilterCriteria } from './components/SearchFilter';
import { Intervention, exportToExcel } from './api/interventions';
import { useAuth } from './context/AuthContext';

const App: React.FC = () => {
  const { user, logout, isAdmin, isWorker } = useAuth();
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [mode, setMode] = useState<'quick' | 'full'>('quick');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingIntervention, setEditingIntervention] = useState<Intervention | null>(null);
  const [filters, setFilters] = useState<FilterCriteria>({
    searchText: '',
    dateFrom: '',
    dateTo: '',
    chaine: '',
    equipement: '',
    mecanicien: '',
    type: '',
    nature_panne: '',
  });
  const [exportLoading, setExportLoading] = useState(false);

  const fetchInterventions = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get<Intervention[]>('http://localhost:5000/api/interventions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInterventions(res.data);
      console.log('Fetched interventions:', res.data);
    } catch (err: any) {
      console.error('Error fetching interventions:', err);
      setError('Failed to load interventions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterventions();
  }, []);

  const uniqueValues = useMemo(() => {
    const chaines = Array.from(new Set(interventions.map(i => i.chaine).filter(Boolean))) as string[];
    const equipements = Array.from(new Set(interventions.map(i => i.equipement).filter(Boolean))) as string[];
    const mecaniciens = Array.from(new Set(interventions.map(i => i.mecanicien).filter(Boolean))) as string[];
    const types = Array.from(new Set(interventions.map(i => i.type).filter(Boolean))) as string[];
    const nature_pannes = Array.from(new Set(interventions.map(i => i.nature_panne).filter(Boolean))) as string[];

    return {
      chaines: chaines.sort(),
      equipements: equipements.sort(),
      mecaniciens: mecaniciens.sort(),
      types: types.sort(),
      nature_pannes: nature_pannes.sort(),
    };
  }, [interventions]);

  const filteredInterventions = useMemo(() => {
    return interventions.filter(interv => {
      if (filters.searchText) {
        const searchLower = filters.searchText.toLowerCase();
        const matchesSearch = 
          (interv.equipement?.toLowerCase().includes(searchLower)) ||
          (interv.symptome?.toLowerCase().includes(searchLower)) ||
          (interv.mecanicien?.toLowerCase().includes(searchLower)) ||
          (interv.reference?.toLowerCase().includes(searchLower)) ||
          (interv.chaine?.toLowerCase().includes(searchLower)) ||
          (interv.diagnostic?.toLowerCase().includes(searchLower)) ||
          (interv.causes?.toLowerCase().includes(searchLower)) ||
          (interv.travaux?.toLowerCase().includes(searchLower));
        
        if (!matchesSearch) return false;
      }

      if (filters.dateFrom && interv.date) {
        if (new Date(interv.date) < new Date(filters.dateFrom)) return false;
      }
      if (filters.dateTo && interv.date) {
        if (new Date(interv.date) > new Date(filters.dateTo)) return false;
      }

      if (filters.chaine && interv.chaine !== filters.chaine) return false;
      if (filters.equipement && interv.equipement !== filters.equipement) return false;
      if (filters.mecanicien && interv.mecanicien !== filters.mecanicien) return false;
      if (filters.type && interv.type !== filters.type) return false;
      if (filters.nature_panne && interv.nature_panne !== filters.nature_panne) return false;

      return true;
    });
  }, [interventions, filters]);

  const handleAdd = async (newIntervention: Intervention) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/interventions', newIntervention, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Intervention added:', res.data);
      
      await fetchInterventions();
      alert('Intervention added successfully!');
    } catch (err: any) {
      console.error('Error adding intervention:', err);
      alert('Failed to add intervention: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleEdit = (intervention: Intervention) => {
    setEditingIntervention(intervention);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdate = async (id: number, updates: Intervention) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`http://localhost:5000/api/interventions/${id}`, updates, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Intervention updated:', res.data);
      
      await fetchInterventions();
      setEditingIntervention(null);
      alert('Intervention updated successfully!');
    } catch (err: any) {
      console.error('Error updating intervention:', err);
      alert('Failed to update intervention: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/interventions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Intervention deleted:', id);
      
      await fetchInterventions();
      alert('Intervention deleted successfully!');
    } catch (err: any) {
      console.error('Error deleting intervention:', err);
      alert('Failed to delete intervention: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleCancelEdit = () => {
    setEditingIntervention(null);
  };

  const handleFilterChange = (newFilters: FilterCriteria) => {
    setFilters(newFilters);
  };

  const handleExportExcel = async () => {
    setExportLoading(true);
    try {
      const blob = await exportToExcel();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `interventions_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error('Export failed:', err);
      alert('Failed to export: ' + (err.response?.data?.error || err.message));
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1600px', margin: '0 auto' }}>
      {/* Header with User Info and Logout */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px',
        padding: '15px',
        background: '#f8f9fa',
        borderRadius: '6px'
      }}>
        <div>
          <h1 style={{ margin: '0 0 5px 0' }}>🏭 Factory Interventions Management</h1>
          <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
            Welcome, <strong>{user?.full_name}</strong> 
            {isAdmin && <span style={{ marginLeft: '10px', padding: '2px 8px', background: '#007bff', color: 'white', borderRadius: '3px', fontSize: '12px' }}>ADMIN</span>}
            {isWorker && <span style={{ marginLeft: '10px', padding: '2px 8px', background: '#28a745', color: 'white', borderRadius: '3px', fontSize: '12px' }}>WORKER</span>}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {isAdmin && (
            <button
              onClick={handleExportExcel}
              disabled={exportLoading}
              style={{
                padding: '8px 16px',
                background: exportLoading ? '#ccc' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: exportLoading ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                fontSize: '14px'
              }}
            >
              {exportLoading ? '⏳ Exporting...' : '📊 Export Excel'}
            </button>
          )}
          <button
            onClick={logout}
            style={{
              padding: '8px 16px',
              background: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px'
            }}
          >
            🚪 Logout
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '20px', padding: '10px', background: '#f0f0f0', borderRadius: '6px' }}>
        <label style={{ fontWeight: 'bold' }}>
          Form Mode:&nbsp;
          <select 
            value={mode} 
            onChange={e => setMode(e.target.value as 'quick' | 'full')}
            style={{ padding: '5px', fontSize: '14px', borderRadius: '4px' }}
          >
            <option value="quick">Quick (Essential Fields)</option>
            <option value="full">Full (All Fields)</option>
          </select>
        </label>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <InterventionForm 
          mode={mode} 
          onAdd={handleAdd}
          onUpdate={handleUpdate}
          editingIntervention={editingIntervention}
          onCancelEdit={handleCancelEdit}
        />
      </div>

      <SearchFilter 
        onFilterChange={handleFilterChange}
        uniqueValues={uniqueValues}
      />

      <h2>
        Interventions Table 
        ({filteredInterventions.length} {filteredInterventions.length !== interventions.length && `of ${interventions.length}`} records)
        {isWorker && <span style={{ fontSize: '14px', color: '#666', fontWeight: 'normal' }}> (Your interventions only)</span>}
      </h2>
      
      {error && (
        <div style={{ padding: '10px', background: '#fee', color: '#c00', borderRadius: '4px', marginBottom: '10px' }}>
          {error}
        </div>
      )}
      
      {loading ? (
        <p>Loading interventions...</p>
      ) : (
        <InterventionTable 
          interventions={filteredInterventions}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default App;