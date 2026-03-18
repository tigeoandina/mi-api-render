// backend/models/User.js

const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
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
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    edad: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    rol: {
      type: DataTypes.STRING,
      defaultValue: 'user'
    }
  }, {
    timestamps: true,
    tableName: 'users'  // ← IMPORTANTE: nombre en minúscula
  });

  // Encriptar password
  User.beforeCreate(async (user) => {
    if (user.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  });

  // Verificar password
  User.prototype.validPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
  };

  return User;

// Al final del archivo, después de module.exports:
if (process.env.NODE_ENV === 'development') {
  sequelize.sync({ force: true });
}

};