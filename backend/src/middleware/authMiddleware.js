// backend/src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

module.exports = function authMiddleware(req, res, next) {
  const h = req.headers.authorization;
  if (!h?.startsWith('Bearer '))
    return res.status(401).json({ message:'Missing or malformed Authorization header.' });

  const token = h.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch(err) {
    console.error('JWT error:', err);
    return res.status(401).json({ message:'Invalid or expired token.' });
  }
};
