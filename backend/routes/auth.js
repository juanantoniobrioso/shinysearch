// backend/routes/auth.js
const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// --- RUTA 1: REGISTRO ---
router.post('/register', async (req, res) => {
  try {
    // 1. ¿Ya existe el usuario?
    const userExists = await User.findOne({ username: req.body.username });
    if (userExists) return res.status(400).json({ message: 'Ese entrenador ya existe' });

    // 2. Encriptar contraseña (Hacerla secreta)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // 3. Crear el usuario nuevo
    const newUser = new User({
      username: req.body.username,
      password: hashedPassword
    });

    // 4. Guardarlo en MongoDB
    const savedUser = await newUser.save();
    res.json({ 
        message: '¡Entrenador registrado!', 
        user: { id: savedUser._id, username: savedUser.username } // <--- AHORA DEVUELVE EL USUARIO COMPLETO
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- RUTA 2: LOGIN ---
router.post('/login', async (req, res) => {
  try {
    // 1. Buscar usuario
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(400).json({ message: 'Usuario no encontrado' });

    // 2. Comprobar contraseña (comparamos la escrita con la encriptada)
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).json({ message: 'Contraseña incorrecta' });

    // 3. ¡Éxito! Devolvemos los datos (sin la contraseña)
    res.json({ 
      message: 'Login exitoso', 
      user: { id: user._id, username: user.username } 
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;