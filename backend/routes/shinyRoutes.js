const router = require('express').Router();
const Shiny = require('../models/Shiny'); // Importamos el modelo que acabamos de crear

// --- RUTA 1: GUARDAR (POST) ---
router.post('/add', async (req, res) => {
  try {
    // 1. CHIVATAZO: Ver qué datos llegan al servidor
    console.log("📥 INTENTO DE GUARDADO. Datos recibidos:", req.body);

    const { pokemonName, game, attempts, userId, sprite } = req.body;

    // 2. VALIDACIÓN MANUAL: Si falta el usuario, gritamos antes de intentar guardar
    if (!userId) {
      throw new Error("¡El userId ha llegado VACÍO! Revisa el Frontend.");
    }

    const newShiny = new Shiny({
      pokemonName,
      game,
      attempts,
      user: userId, // Aquí guardamos la ID
      sprite
    });

    const savedShiny = await newShiny.save();
    console.log("✅ ¡Shiny guardado con éxito en la BD!"); 
    res.status(200).json(savedShiny);

  } catch (err) {
    // 3. SI FALLA: Imprimir el error real en la terminal negra
    console.error("❌ ERROR EXPLOSIVO EN EL SERVIDOR:", err);
    
    // 4. RESPONDER AL FRONTEND: Enviar el mensaje de texto del error
    res.status(500).json({ message: err.message || "Error desconocido" });
  }
});

// --- RUTA 2: LEER (GET) ---
router.get('/collection/:userId', async (req, res) => {
  try {
    const shinies = await Shiny.find({ user: req.params.userId });
    res.status(200).json(shinies);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;