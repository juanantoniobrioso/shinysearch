const Note = require('../models/Note');

// Guardar una nota nueva en la BD
const createNote = async ({ shinyId, text }) => {
    const newNote = new Note({ shinyId, text });
    return await newNote.save();
};

// Buscar las notas de un Shiny concreto
const fetchNotesByShinyId = async (shinyId) => {
    return await Note.find({ shinyId });
};

// Borrar una nota por su ID
const removeNoteById = async (id) => {
    return await Note.findByIdAndDelete(id);
};

module.exports = {
    createNote,
    fetchNotesByShinyId,
    removeNoteById
};