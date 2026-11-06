const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { Rezervacija, Termin, Profesor, Predmet, Ucionica } = require('../models');
const proveriToken = require('../middleware/proveriToken');

router.get('/', proveriToken, async (req, res) => {
  try {
    const rezervacije = await Rezervacija.findAll({
include: [{ model: Termin, include: [Ucionica] }, Profesor, Predmet],    });
    res.json(rezervacije);
  } catch (error) {
    res.status(500).json({ poruka: 'Greška pri učitavanju rezervacija', error: error.message });
  }
});

router.post('/', proveriToken, async (req, res) => {
  try {
    const { termin_id, profesor_id, predmet_id } = req.body;

    const termin = await Termin.findByPk(termin_id);
    if (!termin) {
      return res.status(404).json({ poruka: 'Termin ne postoji.' });
    }

    const predmet = await Predmet.findByPk(predmet_id);
    if (!predmet) {
      return res.status(404).json({ poruka: 'Predmet ne postoji.' });
    }

    // Provera 1 - da li OVAJ termin vec ima aktivnu rezervaciju
    const postojecaRezervacija = await Rezervacija.findOne({
      where: { termin_id, status: 'aktivna' },
    });
    if (postojecaRezervacija) {
      return res.status(409).json({ poruka: 'Ovaj termin je već rezervisan.' });
    }


    const rezervacijeIsteGrupe = await Rezervacija.findAll({
      where: { status: 'aktivna' },
      include: [
        {
          model: Predmet,
          where: {
            nivo_studija: predmet.nivo_studija,
            studijski_program: predmet.studijski_program,
            godina_studija: predmet.godina_studija,
          },
        },
        {
          model: Termin,
          where: {
            datum: termin.datum,
            [Op.and]: [
              { vreme_pocetka: { [Op.lt]: termin.vreme_kraja } },
              { vreme_kraja: { [Op.gt]: termin.vreme_pocetka } },
            ],
          },
        },
      ],
    });

    if (rezervacijeIsteGrupe.length > 0) {
      return res.status(409).json({
        poruka: `Već postoji ispit za ${predmet.studijski_program} (${predmet.godina_studija}. godina) u tom terminu.`,
      });
    }

    const novaRezervacija = await Rezervacija.create({ termin_id, profesor_id, predmet_id });
    const rezultat = await Rezervacija.findByPk(novaRezervacija.id, {
      include: [Termin, Profesor, Predmet],
    });
    res.status(201).json(rezultat);
  } catch (error) {
    res.status(400).json({ poruka: 'Greška pri kreiranju rezervacije', error: error.message });
  }
});


router.put('/:id/otkazi', proveriToken, async (req, res) => {
  try {
    const rezervacija = await Rezervacija.findByPk(req.params.id);
    if (!rezervacija) return res.status(404).json({ poruka: 'Rezervacija nije pronađena.' });

    const jeVlasnik = rezervacija.profesor_id === req.profesor.id;
    const jeAdmin = req.profesor.uloga === 'admin';
    if (!jeVlasnik && !jeAdmin) {
      return res.status(403).json({ poruka: 'Nemate dozvolu da otkažete ovu rezervaciju.' });
    }

    rezervacija.status = 'otkazana';
    await rezervacija.save();
    res.json({ poruka: 'Rezervacija otkazana.', rezervacija });
  } catch (error) {
    res.status(400).json({ poruka: 'Greška pri otkazivanju', error: error.message });
  }
});

router.put('/:id', proveriToken, async (req, res) => {
  try {
    const rezervacija = await Rezervacija.findByPk(req.params.id, { include: [Termin] });
    if (!rezervacija) return res.status(404).json({ poruka: 'Rezervacija nije pronađena.' });

    const jeVlasnik = rezervacija.profesor_id === req.profesor.id;
    const jeAdmin = req.profesor.uloga === 'admin';
    if (!jeVlasnik && !jeAdmin) {
      return res.status(403).json({ poruka: 'Nemate dozvolu da izmenite ovu rezervaciju.' });
    }
    if (rezervacija.status !== 'aktivna') {
      return res.status(400).json({ poruka: 'Ne možete izmeniti otkazanu rezervaciju.' });
    }

    const { predmet_id } = req.body;

    const noviPredmet = await Predmet.findByPk(predmet_id);
    if (!noviPredmet) {
      return res.status(404).json({ poruka: 'Predmet ne postoji.' });
    }

    // Provera preklapanja - ISTA logika kao pri kreiranju, ali iskljucujemo OVU rezervaciju iz provere
    const termin = rezervacija.Termin;

    const konfliktneRezervacije = await Rezervacija.findAll({
      where: {
        status: 'aktivna',
        id: { [Op.ne]: rezervacija.id }, // iskljuci samu sebe
      },
      include: [
        {
          model: Predmet,
          where: {
            nivo_studija: noviPredmet.nivo_studija,
            studijski_program: noviPredmet.studijski_program,
            godina_studija: noviPredmet.godina_studija,
          },
        },
        {
          model: Termin,
          where: {
            datum: termin.datum,
            [Op.and]: [
              { vreme_pocetka: { [Op.lt]: termin.vreme_kraja } },
              { vreme_kraja: { [Op.gt]: termin.vreme_pocetka } },
            ],
          },
        },
      ],
    });

    if (konfliktneRezervacije.length > 0) {
      return res.status(409).json({
        poruka: `Već postoji ispit za ${noviPredmet.studijski_program} (${noviPredmet.godina_studija}. godina) u tom terminu.`,
      });
    }

    rezervacija.predmet_id = predmet_id;
    await rezervacija.save();

    const rezultat = await Rezervacija.findByPk(rezervacija.id, { include: [Termin, Profesor, Predmet] });
    res.json({ poruka: 'Rezervacija izmenjena.', rezervacija: rezultat });
  } catch (error) {
    res.status(400).json({ poruka: 'Greška pri izmeni', error: error.message });
  }
});

module.exports = router;