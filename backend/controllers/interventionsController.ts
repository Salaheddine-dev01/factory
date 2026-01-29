import { Request, Response } from 'express';
import { db } from '../db/connection';

// GET all interventions
export const getInterventions = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query('SELECT * FROM interventions ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching interventions',
      error: error
    });
  }
};

// POST a new intervention
export const addIntervention = async (req: Request, res: Response) => {
  try {
    const { chaine, equipement, symptome, mecanicien, heure_panne, heure_debut, heure_fin } = req.body;

    const [result] = await db.query(
      `INSERT INTO interventions 
       (chaine, equipement, symptome, mecanicien, heure_panne, heure_debut, heure_fin)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [chaine, equipement, symptome, mecanicien, heure_panne, heure_debut, heure_fin]
    );

    res.status(201).json({ message: 'Intervention added successfully', id: (result as any).insertId });
  } catch (error) {
    res.status(500).json({
      message: 'Error adding intervention',
      error: error
    });
  }
};
