const mongoose = require('mongoose');

const ShinySchema = new mongoose.Schema({
  pokemonName: {
    type: String,
    required: true
  },
  sprite: { 
    type: String 
  },
  game: {
    type: String,
    required: true
  },
  attempts: {
    type: Number,
    required: true
  },
  user: {
    type: String, // Aquí guardaremos el ID del usuario que lo atrapó
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Shiny', ShinySchema);