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

// Rota para login de usuários
router.post("/sign-in", UserController.login);

// Rota para buscar tarefas
router.get("/tasks", TaskController.getTasks);

// Rota para buscar tarefas de um usuário
router.get("/tasks/user/:userId", TaskController.getTasksFromUser);

// Rota para criar tarefa
router.post("/tasks", TaskController.createTask);

// Rota para buscar dados de uma tarefa pelo id
router.get("/tasks/:taskId", TaskController.getTask);

// Rota para buscar o progresso de uma tarefa
router.get("/tasks/:taskLogId/progress", TaskController.getTaskProgress);

// Rota para finalizar tarefa
router.post("/tasks/start", TaskController.startTask);

// Rota para finalizar tarefa
router.post("/tasks/finish", TaskController.finishTask);

// Rota para buscar os tipos de atividades
router.get("/activities", ActivityController.getActivitys);

// Rota para buscar a lista de problemas
router.get("/problems", ReportController.getProblems);

// Rota para criar um relatório
router.post("/reports", ReportController.createReport);

module.exports = router;
