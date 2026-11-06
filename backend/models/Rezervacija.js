const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Rezervacija = sequelize.define('Rezervacija', {
  status: { type: DataTypes.ENUM('aktivna', 'otkazana'), defaultValue: 'aktivna' },
}, {
  tableName: 'rezervacije',
});

module.exports = Rezervacija;