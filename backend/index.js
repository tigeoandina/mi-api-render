require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const User = require('./models/User')(sequelize);

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// MIDDLEWARE
// ==========================================
app.use(cors({
  origin: [
    'https://mi-api-frontend.onrender.com',
    'https://mi-api-frontend-0ggv.onrender.com',
    'http://localhost:5173',
    'http://localhost:8081'
  ],
  credentials: true
}));
app.use(express.json());

// ==========================================
// RUTAS BÁSICAS
// ==========================================
app.get('/', (req, res) => {
  res.json({
    mensaje: '¡Hola desde Render.com!',
    autor: 'David Mamani',
    framework: 'Express.js',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// ==========================================
// RUTAS DE AUTENTICACIÓN
// ==========================================
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// ==========================================
// CRUD DE USUARIOS (PROTEGIDO)
// ==========================================
const { verifyToken } = require('./middleware/auth');

app.get('/api/users', verifyToken, async (req, res) => {
  try {
    const users = await User.findAll();
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/users/:id', verifyToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      res.json({ success: true, data: user });
    } else {
      res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/users', verifyToken, async (req, res) => {
  try {
    const { nombre, email, edad } = req.body;
    const user = await User.create({ nombre, email, edad });
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.put('/api/users/:id', verifyToken, async (req, res) => {
  try {
    const { nombre, email, edad } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
    await user.update({ nombre, email, edad });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.delete('/api/users/:id', verifyToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
    await user.destroy();
    res.json({ success: true, message: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================================
// INICIAR SERVIDOR
// ==========================================
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado a PostgreSQL correctamente');
    
    // ✅ CORREGIDO: alter: true (NO borra datos)
    await sequelize.sync({ alter: true });
    console.log('📊 Base de datos sincronizada');
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
      console.log(`📍 URL: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar:', error);
    process.exit(1);
  }
};

startServer();