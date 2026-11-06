const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Ucionica = sequelize.define('Ucionica', {
  naziv: { type: DataTypes.STRING, allowNull: false },
  kapacitet: { type: DataTypes.INTEGER, allowNull: false },
  oprema: { type: DataTypes.STRING, allowNull: true },
}, {
  tableName: 'ucionice',
});

module.exports = Ucionica;