const authService = require('../services/authService');

// Lógica para registrarse
const register = async (req, res) => {
    try {
        const savedUser = await authService.registerUser(req.body);
        
        res.json({ 
            message: '¡Entrenador registrado!', 
            user: { id: savedUser._id, username: savedUser.username }
        });

    } catch (error) {
        // Si el error es de validación (ej. el usuario ya existe), devolvemos 400. Si no, 500.
        const statusCode = error.message === 'Ese entrenador ya existe' ? 400 : 500;
        res.status(statusCode).json({ message: error.message });
    }
};

// Lógica para loguearse
const login = async (req, res) => {
    try {
        const user = await authService.loginUser(req.body);
        
        res.json({ 
            message: 'Login exitoso', 
            user: { id: user._id, username: user.username } 
        });

    } catch (error) {
        // Manejo de errores específicos para enviar el código 400 correcto
        const isAuthError = error.message === 'Usuario no encontrado' || error.message === 'Contraseña incorrecta';
        res.status(isAuthError ? 400 : 500).json({ message: error.message });
    }
};

module.exports = {
    register,
    login
};