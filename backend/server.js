const express = require("express");
const cors = require("cors");
const path = require("path");
const { Pool } = require("pg");
const pool = require("./db");

const app = express();
console.log("DATABASE_URL:",process.env.DATABASE_PUBLIC_URL);
// 🔹 Verificar conexión con la base de datos
pool.connect()
    .then(() => console.log("✅ Conectado a PostgreSQL en Railway"))
    .catch(err => console.error("❌ Error de conexión:", err));

// 🔹 Sirve toda la carpeta "frontend"
app.use(express.static(path.join(__dirname, "../frontend")));

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas de API
app.use("/usuarios", require("./routes/usuarios"));
app.use("/sanciones", require("./routes/sanciones"));
app.use("/historial", require("./routes/historial"));

// 🔹 Ruta principal que carga index.html automáticamente
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// 🔹 Servir archivos estáticos de "assets"
app.use("/assets", express.static(path.join(__dirname, "../frontend/assets")));

// 🔹 Rutas para otras páginas HTML
app.get("/:pagina", (req, res) => {
    const pagina = req.params.pagina;
    const filePath = path.join(__dirname, `../frontend/${pagina}.html`);

    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(404).send("Página no encontrada");
        }
    });
});

// 🔹 Iniciar servidor en el puerto de Railway
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
