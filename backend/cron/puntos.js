// backend/cron/puntos.js
const cron = require('node-cron');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Importante para Railway
});

// Ejecutar a las 00:00 todos los días
cron.schedule('* * * * *', async () => {
  try {
    console.log('[CRON] Ejecutando procesar_puntos_automaticos()');
    await pool.query('SELECT procesar_puntos_automaticos();');
    console.log('[CRON] Ejecución completada ✅');
  } catch (error) {
    console.error('[CRON] Error:', error.message);
  }
});
