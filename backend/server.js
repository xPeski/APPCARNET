const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

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

// Iniciar servidor
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
