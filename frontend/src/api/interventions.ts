// src/api/interventions.ts
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/interventions';

export interface Intervention {
  id?: number | null;
  pilote_rmec?: string | null;
  type?: string | null;
  service_demandeur?: string | null;
  date?: string | null;
  chaine?: string | null;
  equipement?: string | null;
  reference?: string | null;
  symptome?: string | null;
  intervention_demandee?: string | null;
  heure_panne?: string | null;
  heure_debut?: string | null;
  heure_fin?: string | null;
  diagnostic?: string | null;
  causes?: string | null;
  travaux?: string | null;
  pieces_rechange?: string | null;
  quantite?: string | null;
  mecanicien?: string | null;
  fin_intervention?: string | null;
  nature_panne?: string | null;
  tps_reponse?: string | null;
  duree_intervention?: string | null;
  disponibilite?: string | null;
  created_at?: string | null;
}

// Get auth token from localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getInterventions = async (): Promise<Intervention[]> => {
  const res = await axios.get(API_URL, { headers: getAuthHeaders() });
  return res.data;
};

export const addIntervention = async (interv: Intervention): Promise<Intervention> => {
  try {
    const res = await axios.post(API_URL, interv, { headers: getAuthHeaders() });
    return res.data;
  } catch (error: any) {
    console.error('Axios error in addIntervention:', error.response?.data || error.message);
    throw error;
  }
};

export const editIntervention = async (id: number, updates: Intervention): Promise<Intervention> => {
  const res = await axios.put(`${API_URL}/${id}`, updates, { headers: getAuthHeaders() });
  return res.data;
};

export const deleteIntervention = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
};

export const exportToExcel = async (): Promise<Blob> => {
  const res = await axios.get('http://localhost:5000/api/export/excel', {
    headers: getAuthHeaders(),
    responseType: 'blob'
  });
  return res.data;
};