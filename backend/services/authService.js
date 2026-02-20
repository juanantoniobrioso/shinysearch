const User = require('../models/User'); 
const bcrypt = require('bcrypt'); 

const registerUser = async ({ username, password }) => {
    // 1. Comprobar que exista el usuario
    const userExists = await User.findOne({ username });
    if (userExists) {
        throw new Error('Ese entrenador ya existe');
    }

    // 2. Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Crear el usuario nuevo
    const newUser = new User({
        username,
        password: hashedPassword
    });

    // 4. Guardarlo en MongoDB y devolverlo
    return await newUser.save();
};

const loginUser = async ({ username, password }) => {
    // 1. Buscar usuario
    const user = await User.findOne({ username });
    if (!user) {
        throw new Error('Usuario no encontrado');
    }

    // 2. Comprobar contraseña
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
        throw new Error('Contraseña incorrecta');
    }

    // 3. Devolver el usuario si todo es correcto
    return user;
};

module.exports = {
    registerUser,
    loginUser
};