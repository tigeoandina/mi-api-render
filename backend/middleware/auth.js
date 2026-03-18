const jwt = require('jsonwebtoken');
const User = require('../models/User')(require('../config/database'));

const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_super_seguro_2026';

module.exports = {
  // Middleware para verificar token JWT
  verifyToken: async (req, res, next) => {
    try {
      // Obtener token del header
      const authHeader = req.headers.authorization;
      
      if (!authHeader) {
        return res.status(401).json({ 
          error: 'No se proporcionó token de autenticación' 
        });
      }

      // El formato es: "Bearer <token>"
      const token = authHeader.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({ 
          error: 'Token inválido' 
        });
      }

      // Verificar token
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Buscar usuario
      const user = await User.findByPk(decoded.id);
      
      if (!user) {
        return res.status(401).json({ 
          error: 'Usuario no encontrado' 
        });
      }

      // Agregar usuario al request
      req.user = decoded;
      next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ 
          error: 'Token inválido' 
        });
      }
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          error: 'Token expirado' 
        });
      }
      console.error('Error en verifyToken:', error);
      res.status(500).json({ 
        error: 'Error al verificar autenticación' 
      });
    }
  },

  // Middleware para verificar si es admin
  isAdmin: (req, res, next) => {
    if (req.user.rol !== 'admin') {
      return res.status(403).json({ 
        error: 'Acceso denegado. Se requiere rol de administrador' 
      });
    }
    next();
  }
};