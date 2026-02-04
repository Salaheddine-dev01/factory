// src/components/SearchFilter.tsx
import React, { useState } from 'react';

export interface FilterCriteria {
  searchText: string;
  dateFrom: string;
  dateTo: string;
  chaine: string;
  equipement: string;
  mecanicien: string;
  type: string;
  nature_panne: string;
}

interface SearchFilterProps {
  onFilterChange: (filters: FilterCriteria) => void;
  uniqueValues: {
    chaines: string[];
    equipements: string[];
    mecaniciens: string[];
    types: string[];
    nature_pannes: string[];
  };
}

const SearchFilter: React.FC<SearchFilterProps> = ({ onFilterChange, uniqueValues }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
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

  const handleChange = (field: keyof FilterCriteria, value: string) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearAll = () => {
    const emptyFilters: FilterCriteria = {
      searchText: '',
      dateFrom: '',
      dateTo: '',
      chaine: '',
      equipement: '',
      mecanicien: '',
      type: '',
      nature_panne: '',
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const activeFilterCount = Object.values(filters).filter(v => v !== '').length;

  return (
    <div style={{ 
      border: '1px solid #ccc', 
      borderRadius: '6px', 
      padding: '15px', 
      background: '#f8f9fa',
      marginBottom: '20px' 
    }}>
      {/* Quick Search Bar */}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
          🔍 Quick Search (searches all text fields)
        </label>
        <input
          type="text"
          placeholder="Search by equipment, symptom, mechanic, reference, etc..."
          value={filters.searchText}
          onChange={(e) => handleChange('searchText', e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '14px',
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
        />
      </div>

      {/* Advanced Filters Toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          style={{
            padding: '8px 12px',
            background: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          {showAdvanced ? '▲ Hide' : '▼ Show'} Advanced Filters
          {activeFilterCount > 0 && ` (${activeFilterCount} active)`}
        </button>

        {activeFilterCount > 0 && (
          <button
            onClick={handleClearAll}
            style={{
              padding: '8px 12px',
              background: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Clear All Filters
          </button>
        )}
      </div>

      {/* Advanced Filters Panel */}
      {showAdvanced && (
        <div style={{
          padding: '15px',
          background: 'white',
          borderRadius: '4px',
          border: '1px solid #dee2e6'
        }}>
          <h4 style={{ marginTop: 0, marginBottom: '15px' }}>Advanced Filters</h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            {/* Date Range */}
            <div>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', fontSize: '12px' }}>
                Date From
              </label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleChange('dateFrom', e.target.value)}
                style={{ width: '100%', padding: '6px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>

            <div>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', fontSize: '12px' }}>
                Date To
              </label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleChange('dateTo', e.target.value)}
                style={{ width: '100%', padding: '6px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>

            {/* Chaine Filter */}
            <div>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', fontSize: '12px' }}>
                Chaine
              </label>
              <select
                value={filters.chaine}
                onChange={(e) => handleChange('chaine', e.target.value)}
                style={{ width: '100%', padding: '6px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                <option value="">All</option>
                {uniqueValues.chaines.map(val => (
                  <option key={val} value={val}>{val}</option>
                ))}
              </select>
            </div>

            {/* Equipment Filter */}
            <div>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', fontSize: '12px' }}>
                Equipement
              </label>
              <select
                value={filters.equipement}
                onChange={(e) => handleChange('equipement', e.target.value)}
                style={{ width: '100%', padding: '6px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                <option value="">All</option>
                {uniqueValues.equipements.map(val => (
                  <option key={val} value={val}>{val}</option>
                ))}
              </select>
            </div>

            {/* Mechanic Filter */}
            <div>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', fontSize: '12px' }}>
                Mécanicien
              </label>
              <select
                value={filters.mecanicien}
                onChange={(e) => handleChange('mecanicien', e.target.value)}
                style={{ width: '100%', padding: '6px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                <option value="">All</option>
                {uniqueValues.mecaniciens.map(val => (
                  <option key={val} value={val}>{val}</option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', fontSize: '12px' }}>
                Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => handleChange('type', e.target.value)}
                style={{ width: '100%', padding: '6px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                <option value="">All</option>
                {uniqueValues.types.map(val => (
                  <option key={val} value={val}>{val}</option>
                ))}
              </select>
            </div>

            {/* Nature Panne Filter */}
            <div>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px', fontSize: '12px' }}>
                Nature Panne
              </label>
              <select
                value={filters.nature_panne}
                onChange={(e) => handleChange('nature_panne', e.target.value)}
                style={{ width: '100%', padding: '6px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                <option value="">All</option>
                {uniqueValues.nature_pannes.map(val => (
                  <option key={val} value={val}>{val}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilter;