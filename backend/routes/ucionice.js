const express = require('express');
const router = express.Router();
const { Ucionica } = require('../models');

// GET /api/ucionice - vrati sve ucionice
router.get('/', async (req, res) => {
  try {
    const ucionice = await Ucionica.findAll();
    res.json(ucionice);
  } catch (error) {
    res.status(500).json({ poruka: 'Greška pri učitavanju učionica', error: error.message });
  }
});

// POST /api/ucionice - kreiraj novu ucionicu
router.post('/', async (req, res) => {
  try {
    const { naziv, kapacitet, oprema } = req.body;
    const novaUcionica = await Ucionica.create({ naziv, kapacitet, oprema });
    res.status(201).json(novaUcionica);
  } catch (error) {
    res.status(400).json({ poruka: 'Greška pri kreiranju učionice', error: error.message });
  }
});

// PUT /api/ucionice/:id - izmena ucionice
router.put('/:id', async (req, res) => {
  try {
    const ucionica = await Ucionica.findByPk(req.params.id);
    if (!ucionica) {
      return res.status(404).json({ poruka: 'Učionica nije pronađena.' });
    }
    const { naziv, kapacitet, oprema } = req.body;
    await ucionica.update({ naziv, kapacitet, oprema });
    res.json(ucionica);
  } catch (error) {
    res.status(400).json({ poruka: 'Greška pri izmeni učionice', error: error.message });
  }
});

// DELETE /api/ucionice/:id - brisanje ucionice
router.delete('/:id', async (req, res) => {
  try {
    const ucionica = await Ucionica.findByPk(req.params.id);
    if (!ucionica) {
      return res.status(404).json({ poruka: 'Učionica nije pronađena.' });
    }
    await ucionica.destroy();
    res.json({ poruka: 'Učionica obrisana.' });
  } catch (error) {
    res.status(400).json({ poruka: 'Greška pri brisanju - možda ima povezane termine.', error: error.message });
  }
});

module.exports = router;