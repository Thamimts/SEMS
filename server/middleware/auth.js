const jwt = require('jsonwebtoken');
const env = require('../config/env');

const verifyToken = (token) => {
  try {
    return jwt.verify(token, env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  req.user = decoded;
  next();
};

const socketAuthMiddleware = (socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error('Authentication error'));
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return next(new Error('Invalid or expired token'));
  }

  socket.user = decoded;
  next();
};

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRE }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
    },
    env.JWT_SECRET,
    { expiresIn: env.JWT_REFRESH_EXPIRE }
  );
};

module.exports = {
  authMiddleware,
  socketAuthMiddleware,
  generateToken,
  generateRefreshToken,
  verifyToken,
};
