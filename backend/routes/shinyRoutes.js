const express = require('express');
const router = express.Router();
// Importamos el controlador
const shinyController = require('../controllers/shinyController');

// Definición limpia de rutas
router.post('/add', shinyController.createShiny);
router.get('/collection/:userId', shinyController.getShinies);
router.put('/update/:id', shinyController.updateShiny);
router.delete('/delete/:id', shinyController.deleteShiny);

module.exports = router;