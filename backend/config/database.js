// backend/config/database.js

require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

// Probar conexión
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado a PostgreSQL correctamente');
  } catch (error) {
    console.error('❌ Error conectando a PostgreSQL:', error.message);
  }
};

testConnection();

module.exports = sequelize;