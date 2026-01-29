import express from 'express';
import { db } from '../../db/connection';

const router = express.Router();

// Existing GET / POST routes...

// PUT /api/interventions/:id  → Edit an intervention
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const fields = Object.keys(updates)
      .map((key) => `${key} = ?`)
      .join(', ');
    const values = Object.values(updates);

    await db.query(`UPDATE interventions SET ${fields} WHERE id = ?`, [...values, id]);
    res.json({ message: 'Intervention updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating intervention', error: err });
  }
});

// DELETE /api/interventions/:id  → Delete an intervention
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  console.log('DELETE request for id:', id); // optional: debug log

  try {
    // Execute DELETE query
    const [result] = await db.query('DELETE FROM interventions WHERE id = ?', [id]);

    // @ts-ignore (because mysql2 types may not know affectedRows)
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Intervention not found' });
    }

    res.json({ message: 'Intervention deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting intervention', error: err });
  }
});


export default router;
