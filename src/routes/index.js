const express = require("express");
const { getUsers } = require("../controllers/userController");

const router = express.Router();

// Define rota para buscar usuários
router.get("/users", getUsers);

module.exports = router;
