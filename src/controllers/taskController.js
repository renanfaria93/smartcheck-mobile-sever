// controller/taskController.js

const CustomError = require("../utils/customError");
const TaskService = require("../services/taskService");
const { validate: validateUUID } = require("uuid");

class TaskController {
  // Método para buscar todas as tarefas
  static async getTasks(req, res) {
    try {
      // Busca as tarefas
      const tasks = await TaskService.getTasks();

      return res.status(200).json({
        status: "success",
        results: tasks,
      });
    } catch (error) {
      const statusCode = error instanceof CustomError ? error.statusCode : 500;
      return res.status(statusCode).json({
        status: "error",
        error: { message: error.message || "Ocorreu um erro desconhecido" },
      });
    }
  }

  // Método para buscar as tarefas de um usuário
  static async getTasksFromUser(req, res) {
    const { userId } = req.params;

    // Validação do UUID do userId
    if (!validateUUID(userId)) {
      return res.status(400).json({
        status: "error",
        error: { message: "O userId deve ser um UUID válido." },
      });
    }

    try {
      // Busca as tarefas
      const tasks = await TaskService.getTasks(userId);

      return res.status(200).json({
        status: "success",
        results: tasks,
      });
    } catch (error) {
      const statusCode = error instanceof CustomError ? error.statusCode : 500;
      return res.status(statusCode).json({
        status: "error",
        error: { message: error.message || "Ocorreu um erro desconhecido" },
      });
    }
  }

  // Método para criar uma tarefa
  static async createTask(req, res) {
    const {
      title,
      userId,
      activityId,
      tag,
      dueDate,
      image,
      generalDescription,
      securityDescription,
    } = req.body;

    // Validação dos campos obrigatórios
    if (
      !title ||
      !userId ||
      !activityId ||
      !tag ||
      !dueDate ||
      !image ||
      !generalDescription ||
      !securityDescription
    ) {
      return res.status(400).json({
        status: "error",
        error: { message: "Todos os campos são obrigatórios." },
      });
    }

    // Verifica se o title tem comprimento máximo de 50 caracteres
    if (title.length > 50) {
      return res.status(400).json({
        status: "error",
        error: { message: "O título não pode ter mais de 50 caracteres." },
      });
    }

    // Verifica se a tag tem comprimento máximo de 30 caracteres
    if (tag.length > 30) {
      return res.status(400).json({
        status: "error",
        error: { message: "A tag não pode ter mais de 30 caracteres." },
      });
    }

    // Verifica se userId e activityId são UUIDs válidos
    if (!validateUUID(userId) || !validateUUID(activityId)) {
      return res.status(400).json({
        status: "error",
        error: { message: "userId e activityId devem ser UUIDs válidos." },
      });
    }

    // Verifica se dueDate está em um formato de timestamp válido
    const dueDateTimestamp = new Date(dueDate);
    if (isNaN(dueDateTimestamp.getTime())) {
      return res.status(400).json({
        status: "error",
        error: { message: "dueDate deve ser uma data válida." },
      });
    }

    // Verifica se dueDate não é uma data no passado
    const now = new Date();
    if (dueDateTimestamp < now) {
      return res.status(400).json({
        status: "error",
        error: { message: "dueDate não pode ser uma data no passado." },
      });
    }

    try {
      // Cria a tarefa
      const task = await TaskService.createTask({
        title,
        userId,
        activityId,
        tag,
        dueDate,
        image,
        generalDescription,
        securityDescription,
      });

      return res.status(201).json({
        status: "success",
        data: task,
      });
    } catch (error) {
      const statusCode = error instanceof CustomError ? error.statusCode : 500;
      return res.status(statusCode).json({
        status: "error",
        error: { message: error.message || "Ocorreu um erro desconhecido." },
      });
    }
  }

  // Método para buscar dados de uma tarefa
  static async getTask(req, res) {
    const { taskId } = req.params;

    // Validação do UUID do taskId
    if (!validateUUID(taskId)) {
      return res.status(400).json({
        status: "error",
        error: { message: "O taskId deve ser um UUID válido." },
      });
    }

    try {
      const task = await TaskService.getTask(taskId);

      // Verifica se encontrou a tarefa
      if (!task) {
        return res.status(404).json({
          status: "error",
          error: { message: "Tarefa não encontrada" },
        });
      }

      return res.status(200).json({
        status: "success",
        results: task,
      });
    } catch (error) {
      const statusCode = error instanceof CustomError ? error.statusCode : 500;
      return res.status(statusCode).json({
        status: "error",
        error: { message: error.message || "Ocorreu um erro desconhecido." },
      });
    }
  }
}

module.exports = TaskController;
