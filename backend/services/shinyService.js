const Shiny = require('../models/Shiny'); 

// Solo interactúa con la BD, no sabe nada de 'req' o 'res'
const addShiny = async (shinyData) => {
    if (!shinyData.userId) {
        throw new Error("¡El userId ha llegado VACÍO! Revisa el Frontend.");
    }

    const newShiny = new Shiny({
        pokemonName: shinyData.pokemonName,
        game: shinyData.game,
        attempts: shinyData.attempts,
        user: shinyData.userId, 
        sprite: shinyData.sprite
    });

    return await newShiny.save();
};

const getUserShinies = async (userId) => {
    return await Shiny.find({ user: userId });
};

const editShiny = async (id, updateData) => {
    const updatedShiny = await Shiny.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
    );
    if (!updatedShiny) throw new Error("Shiny no encontrado");
    return updatedShiny;
};

const removeShiny = async (id) => {
    return await Shiny.findByIdAndDelete(id);
};

module.exports = {
    addShiny,
    getUserShinies,
    editShiny,
    removeShiny
};