const express = require('express');
const router = express.Router();
const { Predmet } = require('../models');

router.get('/', async (req, res) => {
  try {
    const predmeti = await Predmet.findAll();
    res.json(predmeti);
  } catch (error) {
    res.status(500).json({ poruka: 'Greška pri učitavanju predmeta', error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { naziv, nivo_studija, studijski_program, godina_studija } = req.body;
    const noviPredmet = await Predmet.create({ naziv, nivo_studija, studijski_program, godina_studija });
    res.status(201).json(noviPredmet);
  } catch (error) {
    res.status(400).json({ poruka: 'Greška pri kreiranju predmeta', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const predmet = await Predmet.findByPk(req.params.id);
    if (!predmet) return res.status(404).json({ poruka: 'Predmet nije pronađen.' });
    const { naziv, nivo_studija, studijski_program, godina_studija } = req.body;
    await predmet.update({ naziv, nivo_studija, studijski_program, godina_studija });
    res.json(predmet);
  } catch (error) {
    res.status(400).json({ poruka: 'Greška pri izmeni', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const predmet = await Predmet.findByPk(req.params.id);
    if (!predmet) return res.status(404).json({ poruka: 'Predmet nije pronađen.' });
    await predmet.destroy();
    res.json({ poruka: 'Predmet obrisan.' });
  } catch (error) {
    res.status(400).json({ poruka: 'Greška pri brisanju - možda ima povezane rezervacije.', error: error.message });
  }
});

module.exports = router;