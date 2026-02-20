const shinyService = require('../services/shinyService');

const createShiny = async (req, res) => {
    try {
        console.log("INTENTO DE GUARDADO. Datos recibidos:", req.body);
        // Le pasamos los datos al servicio
        const savedShiny = await shinyService.addShiny(req.body); 
        
        console.log("✅ ¡Shiny guardado con éxito en la BD!"); 
        res.status(200).json(savedShiny);
    } catch (err) {
        console.error("❌ ERROR EXPLOSIVO EN EL SERVIDOR:", err);
        res.status(500).json({ message: err.message || "Error desconocido" });
    }
};

const getShinies = async (req, res) => {
    try {
        const shinies = await shinyService.getUserShinies(req.params.userId);
        res.status(200).json(shinies);
    } catch (err) {
        res.status(500).json({ message: "Error al obtener la colección" });
    }
}

const updateShiny = async (req, res) => {
    try {
        const { attempts, game, notes } = req.body;
        // El servicio hace la actualización
        const updatedShiny = await shinyService.editShiny(req.params.id, { attempts, game, notes });
        res.json(updatedShiny);
    } catch (error) {
        res.status(500).json({ message: error.message || "Error al actualizar" });
    }
};

const deleteShiny = async (req, res) => {
    try {
        await shinyService.removeShiny(req.params.id);
        res.status(200).json("El Shiny ha sido liberado (borrado)");
    } catch (err) {
        res.status(500).json({ message: "Error al borrar" });
    }
};

module.exports = {
    createShiny,
    getShinies,
    updateShiny,
    deleteShiny
};