const jwt = require('jsonwebtoken');

const sequelize = require('../config/database');
const User = require('../models/User')(sequelize);

const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_super_seguro_2026';

// Generar token JWT
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      rol: user.rol 
    },
    JWT_SECRET,
    { expiresIn: '7d' } // Token válido por 7 días
  );
};

// Registro de usuario
exports.register = async (req, res) => {
  try {
    const { nombre, email, password, edad, rol } = req.body;

    // Validar campos requeridos
    if (!nombre || !email || !password || !edad) {
      return res.status(400).json({ 
        error: 'Todos los campos son obligatorios' 
      });
    }

    // Verificar si el email ya existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ 
        error: 'El email ya está registrado' 
      });
    }

    // Crear usuario
    const user = await User.create({
      nombre,
      email,
      password,
      edad,
      rol: rol || 'user'
    });

    // Generar token
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        user: {
          id: user.id,
          nombre: user.nombre,
          email: user.email,
          edad: user.edad,
          rol: user.rol
        },
        token
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ 
      error: 'Error al registrar el usuario' 
    });
  }
};

// Login de usuario
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar campos
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email y password son requeridos' 
      });
    }

    // Buscar usuario
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas' 
      });
    }

    // Verificar password
    const isValidPassword = await user.validPassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas' 
      });
    }

    // Generar token
    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Login exitoso',
      data: {
        user: {
          id: user.id,
          nombre: user.nombre,
          email: user.email,
          edad: user.edad,
          rol: user.rol
        },
        token
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      error: 'Error al iniciar sesión' 
    });
  }
};

// Obtener usuario actual (para validar token)
exports.me = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'nombre', 'email', 'edad', 'rol']
    });

    if (!user) {
      return res.status(404).json({ 
        error: 'Usuario no encontrado' 
      });
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ 
      error: 'Error al obtener información del usuario' 
    });
  }
};