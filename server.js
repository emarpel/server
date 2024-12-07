const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient(); // Instância do Prisma Client
const authController = require('./controllers/authController');
const sendRecoveryEmail = require('./controllers/sendRecoveryEmail');
const userRoutes = require('./routes/userRoutes');
const { verifyToken } = require('./middleware/verifyToken');  // Importando o verifyToken
const app = express();
const cors = require('cors');

// Configurações de CORS
app.use(cors());

// Configuração do servidor para lidar com JSON e URL Encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota de login
app.post('/login', authController.login);

// Rota recovery password
app.post('/recovery', sendRecoveryEmail.sendRecoveryEmail);

// Rota de teste para verificar a conexão com o banco de dados
app.get('/test-db-connection', async (req, res) => {
  try {
    // Tentando fazer uma consulta simples no banco de dados
    const users = await prisma.users.findMany(); // Tenta buscar usuários na tabela 'user'
    res.status(200).send({ message: 'Conexão com o banco de dados bem-sucedida!', users });
  } catch (err) {
    console.error('Erro de conexão com o banco de dados:', err);
    res.status(500).send({ message: 'Erro ao conectar ao banco de dados', error: err });
  }
});

// Rota protegida (usuários) com verificação do token
app.use('/api', verifyToken, userRoutes);  // Usar as novas rotas para usuários com verificação de token

// Iniciando o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});