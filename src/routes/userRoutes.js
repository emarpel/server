const express = require('express');
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/verifyToken');
const { isAdmin } = require('../middleware/isAdmin');
const { sendRecoveryEmail } = require('../controllers/sendRecoveryEmail');
const router = express.Router();

// Listar usuários (qualquer um pode acessar)
router.get('/users', verifyToken, userController.listUsers);

// Lista usuário pelo id (somente admin pode acessar)
router.get('/users/:id', verifyToken, isAdmin, userController.listUserId);

// Criar usuário (somente admin pode acessar)
router.post('/users', verifyToken, isAdmin, userController.createUser);

// Editar usuário (somente admin pode acessar)
router.put('/users/:id', verifyToken, isAdmin, userController.editUser);

// Deletar usuário (somente admin pode acessar)
router.delete('/users/:id', verifyToken, isAdmin, userController.deleteUser);

module.exports = router;
