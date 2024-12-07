const jwt = require('jwt-simple');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const config = require('../config/config');

// Função para login
const login = async (req, res) => {
  const { userLogin, userPassword } = req.body;

  if (!userLogin || !userPassword) {
    return res.status(400).send({ message: 'Preencha todos os campos.' });
  }

  try {
    // Usando Prisma para buscar o usuário pelo login na tabela 'users'
    const user = await prisma.users.findUnique({
      where: { userLogin },
    });

    if (!user) {
      return res.status(404).send({ message: 'Usuário não encontrado.' });
    }

    // Verificar se a senha está correta
    const isPasswordValid = bcrypt.compareSync(userPassword, user.userPassword);
    if (!isPasswordValid) {
      return res.status(401).send({ message: 'Credenciais inválidas.' });
    }

    // Criando o payload do JWT
    const payload = {
      data: {
        userId: user.userId,
        userLogin: user.userLogin,
        userPermission: user.userPermission,
      },
    };

    // Gerando o token JWT
    const token = jwt.encode(payload, config.JWT_SECRET_KEY);

    return res.status(200).send({ message: 'Login realizado com sucesso.', jwt: token });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'Erro ao acessar o banco de dados.' });
  }
};

module.exports = { login };
