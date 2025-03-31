const express = require("express");
const router = express.Router();
const pool = require("../db");

// Obtener todos los usuarios
router.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM usuarios");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Descargar usuarios en CSV (solo para administradores)
router.get("/descargar-usuarios", async (req, res) => {
  const adminId = req.query.adminId; // No convertir directamente a número todavía

  if (!adminId || isNaN(parseInt(adminId, 10))) {
      return res.status(400).send("ID de administrador no válido. Asegúrate de pasar ?adminId=NUMERO");
  }

  const adminIdNum = parseInt(adminId, 10);

  try {
      const userResult = await pool.query("SELECT admin FROM usuarios WHERE id = $1", [adminIdNum]);

      if (userResult.rowCount === 0 || !userResult.rows[0].admin) {
          return res.status(403).send("No tienes permisos de administrador.");
      }

      const result = await pool.query("SELECT * FROM usuarios");
      const usuarios = result.rows;
      const csvHeader = "ID,Puntos,Admin\n";
      const csvRows = usuarios.map(user => `${user.id},${user.puntos},${user.admin}`).join("\n");
      const csvContent = csvHeader + csvRows;

      res.header("Content-Type", "text/csv");
      res.attachment("usuarios.csv");
      res.send(csvContent);
  } catch (error) {
      console.error("Error al generar CSV:", error);
      res.status(500).send("Error al generar el archivo CSV");
  }
});


// Obtener un usuario por ID
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("SELECT * FROM usuarios WHERE id = $1", [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Agregar un nuevo usuario
router.post("/", async (req, res) => {
    const { id, puntos, admin } = req.body;
    try {
        await pool.query("INSERT INTO usuarios (id, puntos, admin) VALUES ($1, $2, $3)", [id, puntos, admin]);
        res.status(201).json({ message: "Usuario agregado correctamente" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Actualizar puntos de un usuario
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { puntos } = req.body;
    try {
        const result = await pool.query("UPDATE usuarios SET puntos = $1 WHERE id = $2 RETURNING *", [puntos, id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        res.json({ mensaje: "Usuario actualizado", usuario: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: "Error en el servidor" });
    }
});

// Eliminar un usuario
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("DELETE FROM usuarios WHERE id = $1 RETURNING *", [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        res.json({ mensaje: "Usuario eliminado", usuario: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: "Error en el servidor" });
    }
});

// Verificar si un usuario es administrador
router.get("/:id/admin", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("SELECT admin FROM usuarios WHERE id = $1", [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        res.json({ esAdmin: result.rows[0].admin });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



module.exports = router;
