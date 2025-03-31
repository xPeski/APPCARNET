const express = require("express");
const pool = require("../db");
const router = express.Router();

// Obtener el historial de sanciones
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT historial.id, historial.fecha, usuarios_admin.id AS admin_id, usuarios_sancionado.id AS usuario_id, sancion.magnitud, sancion.descripcion
      FROM historial
      JOIN usuarios AS usuarios_admin ON historial.admin_id = usuarios_admin.id
      JOIN usuarios AS usuarios_sancionado ON historial.usuario_id = usuarios_sancionado.id
      JOIN sancion ON historial.sancion_id = sancion.id
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Agregar una nueva entrada al historial
router.post("/", async (req, res) => {
  const { usuario_id, sancion_id, admin_id } = req.body;

  if (!usuario_id || !sancion_id || !admin_id) {
      return res.status(400).json({ error: "Usuario, sanción y administrador son requeridos" });
  }

  try {
      await pool.query(
          "INSERT INTO historial (usuario_id, sancion_id, admin_id, fecha) VALUES ($1, $2, $3, NOW())",
          [usuario_id, sancion_id, admin_id]
      );
      res.status(201).json({ mensaje: "Sanción aplicada correctamente" });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

// Eliminar un historial
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await pool.query(
        "DELETE FROM historial WHERE id = $1 RETURNING *",
        [id]
      );
  
      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Registro de historial no encontrado" });
      }
  
      res.json({ mensaje: "Registro eliminado del historial", historial: result.rows[0] });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  router.get("/:usuario_id", async (req, res) => {
    const { usuario_id } = req.params;
    try {
        const result = await pool.query(
            `SELECT h.*, s.descripcion, s.magnitud 
            FROM historial h
            JOIN sancion s ON h.sancion_id = s.id
            WHERE h.usuario_id = $1
            ORDER BY h.fecha DESC`,
            [usuario_id]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: "Error al obtener historial" });
    }
  });
  
module.exports = router;
