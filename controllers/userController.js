const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

// Função para criar um novo usuário
const createUser = async (req, res) => {
  const { userName, userEmail, userCellphone, userLogin, userPassword, userPermission, userPasswordOriginal } = req.body;
  
  // Verificar se os dados necessários foram fornecidos
  if (!userName || !userEmail || !userCellphone || !userLogin || !userPassword || !userPermission || !userPasswordOriginal) {
    return res.status(400).send({ message: 'Preencha todos os campos.' });
  }

  // Criptografar a senha
  const hashedPassword = bcrypt.hashSync(userPassword, 8);

  try {
    const user = await prisma.users.create({
      data: {
        userName,
        userEmail,
        userCellphone,
        userLogin,
        userPassword: hashedPassword,
        userPermission,
        userPasswordOriginal
      }
    });

    res.status(201).send({ message: 'Usuário criado com sucesso!', userId: user.userId });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Erro ao criar o usuário.' });
  }
};

// Função para editar um usuário
const editUser = async (req, res) => {
  const userId = req.params.id;
  const { userName, userEmail, userCellphone, userLogin, userPassword, userPermission } = req.body;

  const dataToUpdate = { userName, userEmail, userCellphone, userLogin, userPermission, userPasswordOriginal };

  if (userPassword) {
    dataToUpdate.userPassword = bcrypt.hashSync(userPassword, 8); // Criptografar a senha
  }

  try {
    const user = await prisma.users.update({
      where: { userId: parseInt(userId) },
      data: dataToUpdate
    });

    res.status(200).send({ message: 'Usuário editado com sucesso!' });
  } catch (error) {
    console.error(error);
    if (error.code === 'P2025') { // Quando não encontra o usuário
      return res.status(404).send({ message: 'Usuário não encontrado.' });
    }
    res.status(500).send({ message: 'Erro ao editar o usuário.' });
  }
};

// Função para deletar um usuário
const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    await prisma.users.delete({
      where: { userId: parseInt(userId) }
    });

    res.status(200).send({ message: 'Usuário deletado com sucesso!' });
  } catch (error) {
    console.error(error);
    if (error.code === 'P2025') { // Quando não encontra o usuário
      return res.status(404).send({ message: 'Usuário não encontrado.' });
    }
    res.status(500).send({ message: 'Erro ao deletar o usuário.' });
  }
};

// Função para listar um usuário pelo id
const listUserId = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await prisma.users.findUnique({
      where: { userId: parseInt(userId) },
      select: {
        userId: true,
        userName: true,
        userEmail: true,
        userCellphone: true,
        userPermission: true
      }
    });

    if (!user) {
      return res.status(404).send({ message: 'Usuário não encontrado.' });
    }

    res.status(200).send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Erro ao listar o usuário.' });
  }
};

// Função para listar todos os usuários
const listUsers = async (req, res) => {
  try {
    const users = await prisma.users.findMany({
      select: {
        userId: true,
        userName: true,
        userEmail: true,
        userCellphone: true,
        userPermission: true
      }
    });

    res.status(200).send(users);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Erro ao listar os usuários.' });
  }
};

module.exports = { createUser, editUser, deleteUser, listUsers, listUserId };
