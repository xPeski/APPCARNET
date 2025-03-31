const pool = require("./db");  // Asegúrate de que la ruta a tu db.js sea correcta

async function insertarUsuarios() {
  const queries = [];
  
  // Crear 130 usuarios con 12 puntos y admin = false
  for (let i = 0; i < 130; i++) {
    const query = pool.query("INSERT INTO usuarios (puntos, admin) VALUES ($1, $2)", [12, false]);
    queries.push(query);  // Añadir la consulta al array
  }

  try {
    // Ejecutar todas las consultas en paralelo
    await Promise.all(queries);
    console.log("Usuarios insertados exitosamente");
  } catch (error) {
    console.error("Error al insertar usuarios:", error.message);
  } finally {
    // Cerrar la conexión a la base de datos
    pool.end();
  }
}

// Llamar a la función para insertar usuarios
insertarUsuarios();
