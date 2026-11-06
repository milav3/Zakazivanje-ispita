const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Predmet = sequelize.define('Predmet', {
  naziv: { type: DataTypes.STRING, allowNull: false },
  nivo_studija: {
    type: DataTypes.ENUM('osnovne', 'master', 'doktorske'),
    allowNull: false,
  },
  studijski_program: { type: DataTypes.STRING, allowNull: false },
  godina_studija: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 4 },
  },
}, {
  tableName: 'predmeti',
});

module.exports = Predmet;