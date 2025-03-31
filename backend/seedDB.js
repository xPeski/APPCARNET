const pool = require("./db");

const seedDatabase = async () => {
  try {
    // Insertar usuarios
    await pool.query(`
      INSERT INTO usuarios (id, puntos, admin) VALUES
      ('550e8400-e29b-41d4-a716-446655440000', 15, true),  -- Admin
      ('550e8400-e29b-41d4-a716-446655440001', 15, false), -- Usuario normal
      ('550e8400-e29b-41d4-a716-446655440002', 10, false)  -- Usuario con menos puntos
      ON CONFLICT (id) DO NOTHING;
    `);

    // Insertar sanciones
    await pool.query(`
      INSERT INTO sancion (magnitud, descripcion) VALUES
      ('leve', 'Exceso de velocidad menor a 20km/h'),
      ('grave', 'Uso del móvil mientras se conduce'),
      ('muy grave', 'Conducir bajo los efectos del alcohol')
      ON CONFLICT (id) DO NOTHING;
    `);

    // Insertar historial (sanciones aplicadas)
    await pool.query(`
      INSERT INTO historial (admin_id, usuario_id, sancion_id, fecha) VALUES
      ('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 1, NOW()),  -- Admin sanciona a usuario 1
      ('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440002', 2, NOW())  -- Admin sanciona a usuario 2
      ON CONFLICT (admin_id, usuario_id, sancion_id) DO NOTHING;
    `);

    console.log("📥 Datos insertados correctamente en la base de datos 🚀");
  } catch (err) {
    console.error("❌ Error insertando datos:", err);
  } finally {
    pool.end();
  }
};

// Ejecutar el script
seedDatabase();
