const jwt = require('jwt-simple');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const config = require('../config/config');

const verifyToken = async (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).send({ message: 'Token não fornecido.' });
  }

  try {
    // Remover o prefixo 'Bearer ' do token, se presente
    const decoded = jwt.decode(token.split(' ')[1], config.JWT_SECRET_KEY);
    
    // Verificar se o usuário existe no banco de dados
    const user = await prisma.users.findUnique({
      where: { userId: decoded.data.userId },
    });

    if (!user) {
      return res.status(404).send({ message: 'Usuário não encontrado.' });
    }

    // Adicionar os dados do usuário no req para que as outras rotas possam acessá-los
    req.user = user;

    next();
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'Erro ao verificar o token.' });
  }
};

module.exports = { verifyToken };
