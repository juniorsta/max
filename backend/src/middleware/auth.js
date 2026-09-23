const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token required' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await prisma.usuario.findUnique({
      where: { id: decoded.userId },
      include: { empresa: true },
    });

    if (!usuario || usuario.empresa.status !== 'active') {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = usuario;
    req.tenant = usuario.empresa;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

function generateToken(user) {
  return jwt.sign(
    { userId: user.id, empresaId: user.empresaId, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
}

function generateRefreshToken(user) {
  return jwt.sign(
    { userId: user.id, type: 'refresh' },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}
module.exports = { authMiddleware, generateToken, generateRefreshToken };