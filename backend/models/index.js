const sequelize = require('../config/database');
const Profesor = require('./Profesor');
const Ucionica = require('./Ucionica');
const IspitniRok = require('./IspitniRok');
const Termin = require('./Termin');
const Rezervacija = require('./Rezervacija');
const Predmet = require('./Predmet');

Ucionica.hasMany(Termin, { foreignKey: 'ucionica_id', onDelete: 'RESTRICT' });
Termin.belongsTo(Ucionica, { foreignKey: 'ucionica_id' });

IspitniRok.hasMany(Termin, { foreignKey: 'ispitni_rok_id', onDelete: 'RESTRICT' });
Termin.belongsTo(IspitniRok, { foreignKey: 'ispitni_rok_id' });

Termin.hasOne(Rezervacija, { foreignKey: 'termin_id', onDelete: 'RESTRICT' });
Rezervacija.belongsTo(Termin, { foreignKey: 'termin_id' });

Profesor.hasMany(Rezervacija, { foreignKey: 'profesor_id', onDelete: 'RESTRICT' });
Rezervacija.belongsTo(Profesor, { foreignKey: 'profesor_id' });

// NOVO - predmet <-> rezervacija
Predmet.hasMany(Rezervacija, { foreignKey: 'predmet_id', onDelete: 'RESTRICT' });
Rezervacija.belongsTo(Predmet, { foreignKey: 'predmet_id' });

module.exports = { sequelize, Profesor, Ucionica, IspitniRok, Termin, Rezervacija, Predmet };