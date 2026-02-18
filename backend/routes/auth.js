const express = require('express');
const router = express.Router();

// CORRECCIÓN 3: El nombre de la variable debe coincidir con el uso abajo
const authController = require('../controllers/authController');

// Definición de rutas
router.post('/register', authController.register);

// CORRECCIÓN 4: El Login debe ser POST, no GET (porque enviamos datos en el body)
router.post('/login', authController.login);

module.exports = router;