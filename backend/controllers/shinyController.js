const Shiny = require('../models/Shiny'); // Asegúrate de importar tu modelo aquí

// Lógica para CREAR
const createShiny = async (req, res) => {
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
};

// Lógica para LISTAR
const getShinies = async (req, res) => {
    try {
        const shinies = await Shiny.find({ user: req.params.userId });
        res.status(200).json(shinies);
      } catch (err) {
        res.status(500).json(err);
      }
}

// Lógica para ACTUALIZAR (La que acabamos de hacer)
const updateShiny = async (req, res) => {
    try {
        const { id } = req.params;
        const { attempts, game, notes } = req.body; // Lo que permitimos editar
    
        // Buscamos por ID y actualizamos
        const updatedShiny = await Shiny.findByIdAndUpdate(
          id,
          { attempts, game, notes }, // Campos a actualizar
          { new: true } // Esto hace que nos devuelva el objeto ya cambiado
        );
    
        if (!updatedShiny) {
          return res.status(404).json({ message: "Shiny no encontrado" });
        }
    
        res.json(updatedShiny);
      } catch (error) {
        res.status(500).json({ message: "Error al actualizar" });
      }
};

// Lógica para BORRAR
const deleteShiny = async (req, res) => {
    try {
        // Buscamos por ID y lo borramos de un golpe
        await Shiny.findByIdAndDelete(req.params.id);
        res.status(200).json("El Shiny ha sido liberado (borrado)");
      } catch (err) {
        res.status(500).json(err);
      }
};

// Exportamos todo junto
module.exports = {
    createShiny,
    getShinies,
    updateShiny,
    deleteShiny
};