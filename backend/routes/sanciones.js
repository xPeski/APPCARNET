const express = require("express");
const pool = require("../db");
const router = express.Router();

// Obtener todas las sanciones
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM sancion");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Agregar una nueva sanción
router.post("/", async (req, res) => {
  const { magnitud, descripcion } = req.body;
  try {
    await pool.query("INSERT INTO sancion (magnitud, descripcion) VALUES ($1, $2)", [magnitud, descripcion]);
    res.status(201).json({ message: "Sanción agregada correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Actualizar una sanción
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { magnitud, descripcion } = req.body;
  
    try {
      const result = await pool.query(
        "UPDATE sancion SET magnitud = $1, descripcion = $2 WHERE id_sancion = $3 RETURNING *",
        [magnitud, descripcion, id]
      );
  
      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Sanción no encontrada" });
      }
  
      res.json({ mensaje: "Sanción actualizada", sancion: result.rows[0] });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  // Eliminar una sanción
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await pool.query(
        "DELETE FROM sancion WHERE id_sancion = $1 RETURNING *",
        [id]
      );
  
      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Sanción no encontrada" });
      }
  
      res.json({ mensaje: "Sanción eliminada", sancion: result.rows[0] });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
module.exports = router;
