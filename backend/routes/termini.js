const express = require('express');
const router = express.Router();
const { Termin, Ucionica, IspitniRok, Rezervacija } = require('../models');

// GET /api/termini - vrati sve termine sa podacima o ucionici i roku
router.get('/', async (req, res) => {
  try {
    const termini = await Termin.findAll({
      include: [
        Ucionica,
        IspitniRok,
        { model: Rezervacija, required: false, where: { status: 'aktivna' } },
      ],
    });
    res.json(termini);
  } catch (error) {
    res.status(500).json({ poruka: 'Greška pri učitavanju termina', error: error.message });
  }
});

// POST /api/termini - kreiraj novi termin
router.post('/', async (req, res) => {
  try {
    const { datum, vreme_pocetka, vreme_kraja, ucionica_id, ispitni_rok_id } = req.body;
     if (vreme_kraja <= vreme_pocetka) {
      return res.status(400).json({ poruka: 'Vreme kraja mora biti posle vremena početka.' });
    }
    const noviTermin = await Termin.create({
      datum, vreme_pocetka, vreme_kraja, ucionica_id, ispitni_rok_id,
    });
    res.status(201).json(noviTermin);
  } catch (error) {
    res.status(400).json({ poruka: 'Greška pri kreiranju termina', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const termin = await Termin.findByPk(req.params.id);
    if (!termin) return res.status(404).json({ poruka: 'Termin nije pronađen.' });
    const { datum, vreme_pocetka, vreme_kraja, ucionica_id, ispitni_rok_id } = req.body;
     if (vreme_kraja <= vreme_pocetka) {
      return res.status(400).json({ poruka: 'Vreme kraja mora biti posle vremena početka.' });
    }
    await termin.update({ datum, vreme_pocetka, vreme_kraja, ucionica_id, ispitni_rok_id });
    res.json(termin);
  } catch (error) {
    res.status(400).json({ poruka: 'Greška pri izmeni', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const termin = await Termin.findByPk(req.params.id);
    if (!termin) return res.status(404).json({ poruka: 'Termin nije pronađen.' });

    // Provera: da li postoji AKTIVNA rezervacija za ovaj termin?
    const aktivnaRezervacija = await Rezervacija.findOne({
      where: { termin_id: termin.id, status: 'aktivna' },
    });

    if (aktivnaRezervacija) {
      return res.status(400).json({ poruka: 'Termin ima aktivnu rezervaciju - prvo je otkažite.' });
    }

    // Ako postoje samo otkazane rezervacije, obriši njih prvo (istorijski zapisi vezani za termin koji nestaje)
    await Rezervacija.destroy({ where: { termin_id: termin.id } });

    await termin.destroy();
    res.json({ poruka: 'Termin obrisan.' });
  } catch (error) {
    res.status(400).json({ poruka: 'Greška pri brisanju termina.', error: error.message });
  }
});

module.exports = router;