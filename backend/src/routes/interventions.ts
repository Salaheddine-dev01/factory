// backend/src/routes/interventions.ts
import express, { Response } from "express";
import pool from "../db";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = express.Router();

const safeDate = (v: any) => {
  if (!v) return null;
  const d = new Date(v);
  return !isNaN(d.getTime()) ? d : null;
};

const safeDateTime = (v: any) => {
  if (!v) return null;
  if (typeof v === 'string' && v.match(/^\d{2}:\d{2}$/)) {
    const today = new Date().toISOString().split('T')[0];
    const d = new Date(`${today}T${v}:00`);
    return !isNaN(d.getTime()) ? d : null;
  }
  const d = new Date(v);
  return !isNaN(d.getTime()) ? d : null;
};

const safeNumber = (v: any) => {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(v);
  return !isNaN(n) ? n : null;
};

const safeString = (v: any) => {
  if (v === null || v === undefined || v === '') return null;
  return String(v);
};

const allFields = [
  "pilote_rmec", "type", "service_demandeur", "date", "chaine", "equipement", "reference",
  "symptome", "intervention_demandee", "heure_panne", "heure_debut", "heure_fin",
  "diagnostic", "causes", "travaux", "pieces_rechange", "quantite", "mecanicien",
  "fin_intervention", "nature_panne", "tps_reponse", "duree_intervention", "disponibilite"
];

// GET all interventions (filtered by role)
router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    let query = "SELECT * FROM interventions";
    let params: any[] = [];

    console.log('GET request from user:', req.user?.username, 'role:', req.user?.role);

    if (req.user?.role === "worker") {
      query += " WHERE mecanicien = ?";
      params.push(req.user.username);
      console.log('Filtering by mecanicien:', req.user.username);
    }

    query += " ORDER BY id DESC";

    const [rows]: any = await pool.query(query, params);
    
    console.log('Query:', query);
    console.log('Params:', params);
    console.log('Rows returned:', rows.length);
    
    if (rows.length > 0) {
      console.log('First row mecanicien:', rows[0].mecanicien);
    }

    res.json(rows);
  } catch (err: any) {
    console.error("DB ERROR [GET /interventions]:", err);
    res.status(500).json({ error: "Error fetching interventions", details: err.message });
  }
});

// GET single intervention
router.get("/:id", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const [rows]: any = await pool.query("SELECT * FROM interventions WHERE id = ?", [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: "Intervention not found" });
    }

    const intervention = rows[0];

    // Workers can only see their own interventions
    if (req.user?.role === "worker" && intervention.mecanicien !== req.user.username) {
      return res.status(403).json({ error: "Access denied" });
    }
    
    res.json(intervention);
  } catch (err: any) {
    console.error("DB ERROR [GET /interventions/:id]:", err);
    res.status(500).json({ error: "Error fetching intervention", details: err.message });
  }
});

// POST new intervention
router.post("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const body = req.body;
    
    console.log('POST request from user:', req.user?.username, 'role:', req.user?.role);
    console.log('Received data:', body);

    // FOR WORKERS: Auto-set mecanicien to their username
    if (req.user?.role === "worker") {
      body.mecanicien = req.user.username;
      console.log('Auto-set mecanicien to:', req.user.username);
    }

    const values = allFields.map((key) => {
      const value = body[key];
      
      if (key === "date") {
        return safeDate(value);
      }
      
      if (["heure_panne", "heure_debut", "heure_fin"].includes(key)) {
        return safeDateTime(value);
      }
      
      if (["quantite", "tps_reponse", "duree_intervention"].includes(key)) {
        return safeNumber(value);
      }
      
      return safeString(value);
    });

    console.log('Values to insert:', values);

    const sql = `
      INSERT INTO interventions
      (${allFields.join(", ")})
      VALUES (${allFields.map(() => "?").join(", ")})
    `;

    const [result]: any = await pool.query(sql, values);

    console.log('Insert successful, ID:', result.insertId);

    res.status(201).json({ 
      message: "Intervention added successfully",
      id: result.insertId
    });
  } catch (err: unknown) {
    console.error("DB ERROR [POST /interventions]:", err);
    res.status(500).json({
      error: "Error adding intervention",
      details: (err as any).sqlMessage || (err as any).message
    });
  }
});

// PUT update intervention
router.put("/:id", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const body = req.body;

    // Check if intervention exists
    const [existing]: any = await pool.query("SELECT * FROM interventions WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: "Intervention not found" });
    }

    // Workers can only update their own interventions
    if (req.user?.role === "worker" && existing[0].mecanicien !== req.user.username) {
      return res.status(403).json({ error: "Access denied" });
    }

    const updates: string[] = [];
    const values: any[] = [];

    allFields.forEach((key) => {
      if (body.hasOwnProperty(key)) {
        updates.push(`${key} = ?`);
        
        if (key === "date") {
          values.push(safeDate(body[key]));
        } else if (["heure_panne", "heure_debut", "heure_fin"].includes(key)) {
          values.push(safeDateTime(body[key]));
        } else if (["quantite", "tps_reponse", "duree_intervention"].includes(key)) {
          values.push(safeNumber(body[key]));
        } else {
          values.push(safeString(body[key]));
        }
      }
    });

    if (updates.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    values.push(id);

    const sql = `UPDATE interventions SET ${updates.join(", ")} WHERE id = ?`;
    await pool.query(sql, values);

    res.json({ 
      message: "Intervention updated successfully",
      id: Number(id)
    });
  } catch (err: any) {
    console.error("DB ERROR [PUT /interventions/:id]:", err);
    res.status(500).json({
      error: "Error updating intervention",
      details: err.sqlMessage || err.message
    });
  }
});

// DELETE intervention (admin only)
router.delete("/:id", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    // Only admins can delete
    if (req.user?.role !== "admin") {
      return res.status(403).json({ error: "Only admins can delete interventions" });
    }

    const { id } = req.params;

    const [existing]: any = await pool.query("SELECT id FROM interventions WHERE id = ?", [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: "Intervention not found" });
    }

    await pool.query("DELETE FROM interventions WHERE id = ?", [id]);

    res.json({ 
      message: "Intervention deleted successfully",
      id: Number(id)
    });
  } catch (err: any) {
    console.error("DB ERROR [DELETE /interventions/:id]:", err);
    res.status(500).json({
      error: "Error deleting intervention",
      details: err.sqlMessage || err.message
    });
  }
});

export default router;