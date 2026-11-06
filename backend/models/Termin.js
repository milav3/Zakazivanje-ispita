const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Termin = sequelize.define('Termin', {
  datum: { type: DataTypes.DATEONLY, allowNull: false },
  vreme_pocetka: { type: DataTypes.TIME, allowNull: false },
  vreme_kraja: { type: DataTypes.TIME, allowNull: false },
}, {
  tableName: 'termini',
});

module.exports = Termin;