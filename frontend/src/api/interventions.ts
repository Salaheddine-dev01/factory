import axios from 'axios';

const API_URL = 'http://localhost:5000/api/interventions';

export interface Intervention {
  id?: number;
  pilote_rmec?: string;
  type?: string;
  service_demandeur?: string;
  date?: string;
  chaine?: string;
  equipement?: string;
  reference?: string;
  symptome?: string;
  intervention_demandee?: string;
  heure_panne?: string;
  heure_debut?: string;
  heure_fin?: string;
  diagnostic?: string;
  causes?: string;
  travaux?: string;
  pieces_rechange?: string;
  quantite?: string;
  mecanicien?: string;
  fin_intervention?: string;
  nature_panne?: string;
  tps_reponse?: string;
  duree_intervention?: string;
  disponibilite?: string;
  prestataire?: string;
  date_commande?: string;
  date_livraison?: string;
  prix_unitaire?: string;
  cout_total?: string;
  efficacite?: string;
}

export const getInterventions = async (): Promise<Intervention[]> => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const addIntervention = async (interv: Intervention): Promise<Intervention> => {
  const res = await axios.post(API_URL, interv);
  return res.data;
};

export const editIntervention = async (id: number, updates: Intervention): Promise<Intervention> => {
  const res = await axios.put(`${API_URL}/${id}`, updates);
  return res.data;
};

export const deleteIntervention = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
