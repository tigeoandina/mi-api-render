const express = require('express');
const app = express();
const port = process.env.PORT || 10000;

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

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en puerto ${port}`);
});