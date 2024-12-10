const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const isAdmin = async (req, res, next) => {
  const userId = req.user.userId; // O `userId` está disponível após o `verifyToken`

  try {
    const user = await prisma.users.findUnique({
      where: { userId },
      select: { userPermission: true },
    });

    if (user && user.userPermission === 'admin') {
      next();
    } else {
      return res.status(403).send({ message: 'Acesso negado. Apenas administradores podem realizar esta operação.' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'Erro ao verificar permissões.' });
  }
};

module.exports = { isAdmin };
