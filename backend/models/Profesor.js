const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Profesor = sequelize.define('Profesor', {
  ime: { type: DataTypes.STRING, allowNull: false },
  prezime: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  lozinka: { type: DataTypes.STRING, allowNull: false },
  uloga: { type: DataTypes.ENUM('profesor', 'admin'), defaultValue: 'profesor' },
  odobren: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  tableName: 'profesori',
});

module.exports = Profesor;