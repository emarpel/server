// routes/authRoutes.js
const express = require('express');
const authController = require('../controllers/authController');
const sendRecoveryEmail = require('../controllers/sendRecoveryEmail');
const verifyToken = require('../middleware/verifyToken');
const router = express.Router();

// Rota de login
router.post('/login', authController.login);

// Recuperação de senha
router.post('/recovery', sendRecoveryEmail.sendRecoveryEmail);

// Rota protegida (exemplo de verificação de token)
router.get('/protected', verifyToken, (req, res) => {
  res.send({ message: 'Você tem acesso a esta rota protegida.' });
});

module.exports = router;