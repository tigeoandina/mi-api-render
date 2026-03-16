const express = require('express');

const cors = require('cors');  // ← AGREGAR ESTA LÍNEA
app.use(cors());               // ← AGREGAR ESTA LÍNEA

const app = express();
const port = process.env.PORT || 10000;

// Importar base de datos y modelo
const { sequelize, testConnection } = require('./database');
const User = require('./models/User');

app.use(express.json());

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

app.get('/api/suma', (req, res) => {
  const { num1, num2 } = req.query;
  const resultado = Number(num1) + Number(num2);
  
  res.json({
    operacion: 'suma',
    num1: Number(num1),
    num2: Number(num2),
    resultado: resultado
  });
});

// Endpoint de saludo personalizado
app.get('/api/saludo', (req, res) => {
  const { nombre } = req.query;
  
  res.json({
    mensaje: `¡Hola ${nombre || 'Mundo'}!`,
    bienvenido: true,
    timestamp: new Date().toISOString()
  });
});

// ==========================================
// CRUD DE USUARIOS
// ==========================================

// GET /api/users - Listar todos los usuarios
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/users/:id - Obtener un usuario por ID
app.get('/api/users/:id', async (req, res) => {
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

// POST /api/users - Crear un nuevo usuario
app.post('/api/users', async (req, res) => {
  try {
    const { nombre, email, edad } = req.body;
    const user = await User.create({ nombre, email, edad });
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// PUT /api/users/:id - Actualizar un usuario
app.put('/api/users/:id', async (req, res) => {
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

// DELETE /api/users/:id - Eliminar un usuario
app.delete('/api/users/:id', async (req, res) => {
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

// Iniciar servidor con conexión a BD
const startServer = async () => {
  try {
    // Probar conexión
    await testConnection();
    
    // Sincronizar modelos (crea tablas si no existen)
    await sequelize.sync({ alter: true });
    console.log('📊 Base de datos sincronizada');
    
    // Iniciar servidor
    app.listen(port, '0.0.0.0', () => {
      console.log(`🚀 Servidor corriendo en puerto ${port}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar:', error);
    process.exit(1);
  }
};

startServer();