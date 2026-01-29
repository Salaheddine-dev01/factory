"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addIntervention = exports.getInterventions = void 0;
const connection_1 = require("../db/connection");
// GET all interventions
const getInterventions = async (req, res) => {
    try {
        const [rows] = await connection_1.db.query('SELECT * FROM interventions ORDER BY created_at DESC');
        res.json(rows);
    }
    catch (error) {
        res.status(500).json({
            message: 'Error fetching interventions',
            error: error
        });
    }
};
exports.getInterventions = getInterventions;
// POST a new intervention
const addIntervention = async (req, res) => {
    try {
        const { chaine, equipement, symptome, mecanicien, heure_panne, heure_debut, heure_fin } = req.body;
        const [result] = await connection_1.db.query(`INSERT INTO interventions 
       (chaine, equipement, symptome, mecanicien, heure_panne, heure_debut, heure_fin)
       VALUES (?, ?, ?, ?, ?, ?, ?)`, [chaine, equipement, symptome, mecanicien, heure_panne, heure_debut, heure_fin]);
        res.status(201).json({ message: 'Intervention added successfully', id: result.insertId });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error adding intervention',
            error: error
        });
    }
};
exports.addIntervention = addIntervention;
