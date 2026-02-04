// backend/src/routes/export.ts
import express, { Response } from "express";
import pool from "../db";
import { authenticate, requireAdmin, AuthRequest } from "../middleware/auth";

const router = express.Router();

// Excel export endpoint (Admin only)
router.get("/excel", authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    console.log('Excel export requested by:', req.user?.username);
    
    const [rows]: any = await pool.query("SELECT * FROM interventions ORDER BY created_at DESC");

    console.log(`Exporting ${rows.length} interventions`);

    // Create CSV content (simple alternative to Excel)
    const headers = [
      "ID", "Pilote RMEC", "Type", "Service Demandeur", "Date", "Chaine", "Equipement",
      "Reference", "Symptome", "Intervention Demandee", "Heure Panne", "Heure Debut",
      "Heure Fin", "Diagnostic", "Causes", "Travaux", "Pieces Rechange", "Quantite",
      "Mecanicien", "Fin Intervention", "Nature Panne", "Temps Reponse", "Duree Intervention",
      "Disponibilite", "Created At"
    ];

    let csvContent = headers.join(",") + "\n";

    rows.forEach((row: any) => {
      const values = [
        row.id || "",
        row.pilote_rmec || "",
        row.type || "",
        row.service_demandeur || "",
        row.date || "",
        row.chaine || "",
        row.equipement || "",
        row.reference || "",
        row.symptome || "",
        row.intervention_demandee || "",
        row.heure_panne || "",
        row.heure_debut || "",
        row.heure_fin || "",
        row.diagnostic || "",
        row.causes || "",
        row.travaux || "",
        row.pieces_rechange || "",
        row.quantite || "",
        row.mecanicien || "",
        row.fin_intervention || "",
        row.nature_panne || "",
        row.tps_reponse || "",
        row.duree_intervention || "",
        row.disponibilite || "",
        row.created_at || ""
      ].map(v => `"${String(v).replace(/"/g, '""')}"`);

      csvContent += values.join(",") + "\n";
    });

    const filename = `interventions_${new Date().toISOString().split('T')[0]}.csv`;
    
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(csvContent);

    console.log('Export successful');

  } catch (err: any) {
    console.error("Export error:", err);
    res.status(500).json({ error: "Export failed", details: err.message });
  }
});

export default router;