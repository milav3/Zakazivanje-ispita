const express = require('express');
const router = express.Router();
const { IspitniRok } = require('../models');

router.get('/', async (req, res) => {
  try {
    const rokovi = await IspitniRok.findAll();
    res.json(rokovi);
  } catch (error) {
    res.status(500).json({ poruka: 'Greška pri učitavanju ispitnih rokova', error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { naziv, datum_pocetka, datum_kraja } = req.body;
    const noviRok = await IspitniRok.create({ naziv, datum_pocetka, datum_kraja });
    res.status(201).json(noviRok);
  } catch (error) {
    res.status(400).json({ poruka: 'Greška pri kreiranju ispitnog roka', error: error.message });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const rok = await IspitniRok.findByPk(req.params.id);
    if (!rok) return res.status(404).json({ poruka: 'Rok nije pronađen.' });
    const { naziv, datum_pocetka, datum_kraja } = req.body;
    await rok.update({ naziv, datum_pocetka, datum_kraja });
    res.json(rok);
  } catch (error) {
    res.status(400).json({ poruka: 'Greška pri izmeni', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const rok = await IspitniRok.findByPk(req.params.id);
    if (!rok) return res.status(404).json({ poruka: 'Rok nije pronađen.' });
    await rok.destroy();
    res.json({ poruka: 'Rok obrisan.' });
  } catch (error) {
    res.status(400).json({ poruka: 'Greška pri brisanju - možda ima povezane termine.', error: error.message });
  }
});

module.exports = router;