const nodemailer = require('nodemailer');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Configuração do Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  SMTPAuth: true,
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Função para enviar o e-mail de recuperação
const sendRecoveryEmail = async (req, res) => {
  const { userEmail } = req.body;

  try {
    // Verificar se o e-mail existe no banco de dados
    const user = await prisma.users.findUnique({
      where: { userEmail: userEmail },
    });

    if (!user) {
      return res.status(404).send({ message: 'E-mail não encontrado.' });
    }

    // Enviar a senha diretamente no e-mail
    const mailOptions = {
      from: 'emarpel@gmail.com',  // Seu e-mail
      to: userEmail,
      subject: 'Recuperação de Senha',
      text: `Olá ${user.userName},\n\nSua senha é: ${user.userPasswordOriginal}\n\nPor favor, não compartilhe sua senha com ninguém.\n\nAtenciosamente,\nBW SYSTEMS`,
    };

    // Enviar o e-mail
    await transporter.sendMail(mailOptions);

    res.status(200).send({ message: 'Sua senha foi enviada para o e-mail.' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Erro ao enviar o e-mail.' });
  }
};

module.exports = { sendRecoveryEmail };