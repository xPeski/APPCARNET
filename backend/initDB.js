const pool = require("./db.js");

const createTables = async () => {
  try {
    await pool.query(`
      CREATE TABLE usuarios (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        puntos INTEGER DEFAULT 15 NOT NULL,
        admin BOOLEAN DEFAULT false NOT NULL
      );

      CREATE TABLE sancion (
        id SERIAL PRIMARY KEY,
        magnitud VARCHAR(20) CHECK (magnitud IN ('leve', 'grave', 'muy grave')) NOT NULL,
        descripcion TEXT NOT NULL
      );

      CREATE TABLE historial (
        id SERIAL PRIMARY KEY,
        admin_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
        usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
        sancion_id INTEGER REFERENCES sancion(id) ON DELETE SET NULL,
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Tablas creadas correctamente 🚀");
  } catch (error) {
    console.error("Error al crear tablas:", error);
  } finally {
    pool.end();
  }
};

createTables();
