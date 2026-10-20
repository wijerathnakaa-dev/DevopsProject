const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'chaceylon_tea_super_secret_jwt_key_2026';

exports.protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: { message: 'Authentication required. No token provided.' }
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      error: { message: 'Session expired or token invalid. Please log in again.' }
    });
  }
};

exports.optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
    } catch (e) {
      // Ignore optional auth failure
    }
  }
  next();
};

exports.adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      error: { message: 'Access denied. Administrator privileges required.' }
    });
  }
  next();
};

exports.JWT_SECRET = JWT_SECRET;
