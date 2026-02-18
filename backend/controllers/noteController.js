const Note = require('../models/Note');

// Añadir una nota nueva
const addNote = async (req, res) => {
  try {
    const { shinyId, text } = req.body;
    const newNote = new Note({ shinyId, text });
    await newNote.save();
    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ message: "Error al crear la nota" });
  }
};

// Obtener todas las notas de un Shiny específico
const getNotesByShiny = async (req, res) => {
  try {
    const notes = await Note.find({ shinyId: req.params.shinyId });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener notas" });
  }
};

module.exports = { addNote, getNotesByShiny };