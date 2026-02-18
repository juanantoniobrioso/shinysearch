// CORRECCIÓN 1: Importamos el modelo con el nombre 'User' (no Shiny)
const User = require('../models/User'); 
// CORRECCIÓN 2: Importamos bcrypt (asegúrate de tener instalado 'bcrypt' o 'bcryptjs')
const bcrypt = require('bcrypt'); // Si usas bcryptjs, cambia esto por require('bcryptjs')

// Lógica para registrarse
const register = async (req, res) => {
    try {
        // 1. ¿Ya existe el usuario?
        const userExists = await User.findOne({ username: req.body.username });
        if (userExists) return res.status(400).json({ message: 'Ese entrenador ya existe' });
    
        // 2. Encriptar contraseña
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
            user: { id: savedUser._id, username: savedUser.username }
        });
    
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
};

// Lógica para loguearse
const login = async (req, res) => {
    try {
        // 1. Buscar usuario
        const user = await User.findOne({ username: req.body.username });
        if (!user) return res.status(400).json({ message: 'Usuario no encontrado' });
    
        // 2. Comprobar contraseña
        const validPass = await bcrypt.compare(req.body.password, user.password);
        if (!validPass) return res.status(400).json({ message: 'Contraseña incorrecta' });
    
        // 3. ¡Éxito!
        res.json({ 
          message: 'Login exitoso', 
          user: { id: user._id, username: user.username } 
        });
    
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
}

module.exports = {
    register,
    login
};