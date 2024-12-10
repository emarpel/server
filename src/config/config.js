// config/config.js
require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env

module.exports = {
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY, // Chave secreta para o JWT
};