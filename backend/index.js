const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Importar rutas
const authRoutes = require('./routes/auth');
const shinyRoutes = require('./routes/shinyRoutes'); 
const noteRoutes = require('./routes/noteRoutes');

const app = express();

// --- MIDDLEWARES (Configuraciones) ---
app.use(cors()); 
app.use(express.json()); 

// --- RUTAS ---
app.use('/api/auth', authRoutes);
app.use('/api/shiny', shinyRoutes);
app.use('/api/notes', noteRoutes);

// --- CONEXIÓN BASE DE DATOS ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB con éxito'))
  .catch((err) => console.error('❌ Error conectando a MongoDB:', err));

// --- ENCENDER SERVIDOR ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});