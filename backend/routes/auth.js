const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Profesor } = require('../models');
require('dotenv').config();

// POST /api/auth/register - registracija novog profesora
router.post('/register', async (req, res) => {
  try {
    const { ime, prezime, email, lozinka, uloga } = req.body;

    if (!lozinka || lozinka.length < 6) {
      return res.status(400).json({ poruka: 'Lozinka mora imati najmanje 6 karaktera.' });
    }

    // Provera da li vec postoji profesor sa tim email-om
    const postojeci = await Profesor.findOne({ where: { email } });
    if (postojeci) {
      return res.status(409).json({ poruka: 'Profesor sa ovim email-om vec postoji.' });
    }

    // Hesiranje lozinke pre cuvanja u bazu (10 = "salt rounds" - koliko puta se hesiranje ponavlja)
    const hashovanaLozinka = await bcrypt.hash(lozinka, 10);

    const noviProfesor = await Profesor.create({
      ime, prezime, email, lozinka: hashovanaLozinka, uloga,
    });

    res.status(201).json({ id: noviProfesor.id, ime, prezime, email, uloga });
  } catch (error) {
    res.status(400).json({ poruka: 'Greška pri registraciji', error: error.message });
  }
});

// POST /api/auth/login - prijava profesora
router.post('/login', async (req, res) => {
  try {
    const { email, lozinka } = req.body;

    const profesor = await Profesor.findOne({ where: { email } });
    if (!profesor) {
      return res.status(401).json({ poruka: 'Pogrešan email ili lozinka.' });
    }

    // Poredi unetu lozinku sa hesovanom iz baze
    const lozinkaTacna = await bcrypt.compare(lozinka, profesor.lozinka);
    if (!lozinkaTacna) {
      return res.status(401).json({ poruka: 'Pogrešan email ili lozinka.' });
    }

     if (!profesor.odobren) {
      return res.status(403).json({ poruka: 'Vaš nalog čeka odobrenje administratora.' });
    }
    
    // Generisanje tokena - vazi 24h, sadrzi id i ulogu profesora
    const token = jwt.sign(
      { id: profesor.id, uloga: profesor.uloga },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      profesor: { id: profesor.id, ime: profesor.ime, prezime: profesor.prezime, uloga: profesor.uloga },
    });
  } catch (error) {
    res.status(500).json({ poruka: 'Greška pri prijavi', error: error.message });
  }
});
const proveriToken = require('../middleware/proveriToken');

// GET /api/auth/me - podaci ulogovanog profesora
router.get('/me', proveriToken, async (req, res) => {
  try {
    const profesor = await Profesor.findByPk(req.profesor.id, {
      attributes: ['id', 'ime', 'prezime', 'email', 'uloga'], // bez lozinke!
    });
    res.json(profesor);
  } catch (error) {
    res.status(500).json({ poruka: 'Greška pri učitavanju profila', error: error.message });
  }
});

// PUT /api/auth/promeni-lozinku
router.put('/promeni-lozinku', proveriToken, async (req, res) => {
  try {
    const { staraLozinka, novaLozinka } = req.body;

    if (!lozinka || lozinka.length < 6) {
      return res.status(400).json({ poruka: 'Lozinka mora imati najmanje 6 karaktera.' });
    }

    const profesor = await Profesor.findByPk(req.profesor.id);
    if (!profesor) {
      return res.status(404).json({ poruka: 'Profesor nije pronađen.' });
    }

    const staraTacna = await bcrypt.compare(staraLozinka, profesor.lozinka);
    if (!staraTacna) {
      return res.status(401).json({ poruka: 'Trenutna lozinka nije tačna.' });
    }

    const novaHashovana = await bcrypt.hash(novaLozinka, 10);
    profesor.lozinka = novaHashovana;
    await profesor.save();

    res.json({ poruka: 'Lozinka uspešno promenjena.' });
  } catch (error) {
    res.status(400).json({ poruka: 'Greška pri promeni lozinke', error: error.message });
  }
});

module.exports = router;