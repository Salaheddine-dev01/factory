import React from 'react';
import { Intervention } from '../api/interventions';

interface DashboardProps { interventions: Intervention[]; }

const Dashboard: React.FC<DashboardProps> = ({ interventions }) => {
  const total = interventions.length;
  const perMechanic: { [key: string]: number } = {};
  const perChain: { [key: string]: number } = {};

  interventions.forEach(i => {
    if (i.mecanicien) perMechanic[i.mecanicien] = (perMechanic[i.mecanicien] || 0) + 1;
    if (i.chaine) perChain[i.chaine] = (perChain[i.chaine] || 0) + 1;
  });

  return (
    <div className="dashboard-container">
      <div className="card">Total Interventions: {total}</div>
      {Object.entries(perMechanic).map(([m, count])=>(
        <div key={m} className="card">{m}: {count}</div>
      ))}
      {Object.entries(perChain).map(([c, count])=>(
        <div key={c} className="card">{c}: {count}</div>
      ))}

      <style>{`
        .dashboard-container {
          display:flex; flex-wrap:wrap; gap:12px;
          font-family:Arial,sans-serif;
        }
        .card {
          background:#007bff; color:#fff; padding:12px 16px; border-radius:6px;
          min-width:150px; text-align:center; font-weight:bold;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
