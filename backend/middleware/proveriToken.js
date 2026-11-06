const jwt = require('jsonwebtoken');
require('dotenv').config();

function proveriToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // format: "Bearer <token>"

  if (!token) {
    return res.status(401).json({ poruka: 'Niste ulogovani.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ poruka: 'Nevalidan ili istekao token.' });
    }
    req.profesor = decoded; // { id, uloga }
    next();
  });
}

module.exports = proveriToken;