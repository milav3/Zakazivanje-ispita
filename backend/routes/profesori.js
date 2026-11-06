const express = require('express');
const router = express.Router();
const { Profesor } = require('../models');
const proveriToken = require('../middleware/proveriToken');
const proveriAdmin = require('../middleware/proveriAdmin');

// GET /api/profesori - vrati sve profesore
router.get('/', async (req, res) => {
  try {
    const profesori = await Profesor.findAll();
    res.json(profesori);
  } catch (error) {
    res.status(500).json({ poruka: 'Greška pri učitavanju profesora', error: error.message });
  }
});

// GET /api/profesori/neodobreni - samo admin vidi profesore koji cekaju odobrenje
router.get('/neodobreni', proveriToken, proveriAdmin, async (req, res) => {
  try {
    const neodobreni = await Profesor.findAll({ where: { odobren: false } });
    res.json(neodobreni);
  } catch (error) {
    res.status(500).json({ poruka: 'Greška pri učitavanju', error: error.message });
  }
});

// PUT /api/profesori/:id/odobri - samo admin odobrava nalog
router.put('/:id/odobri', proveriToken, proveriAdmin, async (req, res) => {
  try {
    const profesor = await Profesor.findByPk(req.params.id);
    if (!profesor) {
      return res.status(404).json({ poruka: 'Profesor nije pronađen.' });
    }
    profesor.odobren = true;
    await profesor.save();
    res.json({ poruka: 'Nalog odobren.', profesor });
  } catch (error) {
    res.status(400).json({ poruka: 'Greška pri odobravanju', error: error.message });
  }
});

module.exports = router;