const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const IspitniRok = sequelize.define('IspitniRok', {
  naziv: { type: DataTypes.STRING, allowNull: false },
  datum_pocetka: { type: DataTypes.DATEONLY, allowNull: false },
  datum_kraja: { type: DataTypes.DATEONLY, allowNull: false },
}, {
  tableName: 'ispitni_rokovi',
});

module.exports = IspitniRok;