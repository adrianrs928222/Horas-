const express = require("express");
const fs = require("fs");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

// 🔥 SERVIR ARCHIVOS DESDE RAÍZ
app.use(express.static(__dirname));

// 📁 MINI BASE DE DATOS JSON
const DB_FILE = "datos.json";

// Crear archivo si no existe
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, "[]");
}

// 🌐 Página principal
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// 📥 Obtener horas
app.get("/api/horas", (req, res) => {

  const datos = JSON.parse(fs.readFileSync(DB_FILE));

  res.json(datos);

});

// ➕ Guardar horas
app.post("/api/horas", (req, res) => {

  const datos = JSON.parse(fs.readFileSync(DB_FILE));

  datos.push(req.body);

  fs.writeFileSync(DB_FILE, JSON.stringify(datos, null, 2));

  res.json({ ok: true });

});

// 🚀 Iniciar servidor
app.listen(PORT, () => {
  console.log("Servidor funcionando en puerto " + PORT);
});