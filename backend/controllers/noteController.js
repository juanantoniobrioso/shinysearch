const noteService = require('../services/noteService');

// Añadir una nota nueva
const addNote = async (req, res) => {
    try {
        const newNote = await noteService.createNote(req.body);
        res.status(201).json(newNote);
    } catch (error) {
        res.status(500).json({ message: "Error al crear la nota" });
    }
};

// Obtener todas las notas de un Shiny específico
const getNotesByShiny = async (req, res) => {
    try {
        const notes = await noteService.fetchNotesByShinyId(req.params.shinyId);
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener notas" });
    }
};

// Función para borrar una nota
const deleteNote = async (req, res) => {
    try {
        await noteService.removeNoteById(req.params.id);
        res.json({ message: "Nota eliminada" });
    } catch (error) {
        res.status(500).json({ message: "Error al borrar la nota" });
    }
};

module.exports = { 
    addNote, 
    getNotesByShiny,
    deleteNote
};