// models/User.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  edad: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'users',
  timestamps: true // Agrega createdAt y updatedAt automáticamente
});

module.exports = User;