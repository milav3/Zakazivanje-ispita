const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const ucioniceRoutes = require('./routes/ucionice');
const profesoriRoutes = require('./routes/profesori');
const ispitniRokoviRoutes = require('./routes/ispitniRokovi');
const terminiRoutes = require('./routes/termini');
const rezervacijeRoutes = require('./routes/rezervacije');

const proveriToken = require('./middleware/proveriToken');
const authRoutes = require('./routes/auth');
const predmetiRoutes = require('./routes/predmeti');
app.use('/api/predmeti', predmetiRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/ucionice', ucioniceRoutes);
app.use('/api/profesori', profesoriRoutes);
app.use('/api/ispitni-rokovi', ispitniRokoviRoutes);
app.use('/api/termini', terminiRoutes);
app.use('/api/rezervacije', proveriToken, rezervacijeRoutes);

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('API radi!');
});

sequelize.sync({ alter: true })
  .then(() => console.log('✅ Baza sinhronizovana - tabele kreirane!'))
  .catch((err) => console.error('❌ Greška pri sinhronizaciji:', err));

app.listen(PORT, () => {
  console.log(`Server radi na http://localhost:${PORT}`);
});