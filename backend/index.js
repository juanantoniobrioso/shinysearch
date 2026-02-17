const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // <--- IMPORTANTE: El portero
require('dotenv').config();

// Importar rutas
const authRoutes = require('./routes/auth');
const shinyRoutes = require('./routes/shinyRoutes'); // <--- Tu nueva ruta

const app = express();

// --- MIDDLEWARES (Configuraciones) ---
app.use(cors()); // <--- ¡Abre las puertas a React!
app.use(express.json()); // Permite leer JSON

// --- RUTAS ---
app.use('/api/auth', authRoutes);
app.use('/api/shiny', shinyRoutes);

// --- CONEXIÓN BASE DE DATOS ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB con éxito'))
  .catch((err) => console.error('❌ Error conectando a MongoDB:', err));

// --- ENCENDER SERVIDOR ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});