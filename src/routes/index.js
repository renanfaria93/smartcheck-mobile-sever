// routes/userRoutes.js

const express = require("express");
const UserController = require("../controllers/userController");
const TaskController = require("../controllers/taskController");
const ActivityController = require("../controllers/activityController");
const ReportController = require("../controllers/reportController");

const router = express.Router();

// Rota para registro de usuários
router.post("/auth/register", UserController.register);

// Rota para reenviar código de confirmação
router.post("/auth/validate-email", UserController.validateEmail);

// Rota para reenviar código de confirmação
router.post("/auth/login", UserController.login);

// Rota para buscar tarefas
router.get("/tasks", TaskController.getTasks);

// Rota para buscar tarefas de um usuário
router.get("/tasks/:userId", TaskController.getTasksFromUser);

// Rota para criar tarefa
router.post("/task", TaskController.createTask);

// Rota para buscar dados de uma tarefa pelo id
router.get("/task/:taskId", TaskController.getTask);

// Rota para buscar os tipos de atividades
router.get("/activitys", ActivityController.getActivitys);

// Rota para buscar a lista de problemas
router.get("/reports/problems", ReportController.getProblems);

// Rota para criar um reporte
router.post("/report", ReportController.createReport);

module.exports = router;
