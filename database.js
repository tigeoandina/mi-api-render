// database.js
const { Sequelize } = require('sequelize');

// Conexión a PostgreSQL usando variable de entorno
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false, // Desactiva logs de SQL en producción
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Requerido para Render
    }
  }
});

// Probar conexión
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a PostgreSQL exitosa');
  } catch (error) {
    console.error('❌ Error de conexión:', error);
  }
};

module.exports = { sequelize, testConnection };