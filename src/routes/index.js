// routes/userRoutes.js

const express = require("express");
const UserController = require("../controllers/userController");

const router = express.Router();

// Rota para registro de usuários
router.post("/register", UserController.register);

// Rota para reenviar código de confirmação
router.post("/validate-email", UserController.validateEmail);

// Rota para reenviar código de confirmação
router.post("/login", UserController.login);

module.exports = router;
