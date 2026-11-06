function proveriAdmin(req, res, next) {
  if (req.profesor.uloga !== 'admin') {
    return res.status(403).json({ poruka: 'Nemate administratorska prava.' });
  }
  next();
}

module.exports = proveriAdmin;