// services/taskService.js

const Task = require("../models/taskModel");

class TaskService {
  // Método para buscar tarefas
  static async getTasks(userId) {
    let tasks;

    // Se não houver parâmetro de id, buscar todas as tarefas
    if (!userId) {
      tasks = await Task.getTasks();
    } else {
      // Se houver parâmetro de id, buscar todas as tarefas do usuário
      tasks = await Task.getTasksByUserId(userId);
    }

    // Filtra os campos necessários antes de retornar
    return tasks.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.general_description,
      due_date: task.due_date,
      status: task.status,
    }));
  }

  //Método para buscar uma tarefa pelo ID
  static async getTask(taskId) {
    return await Task.findById(taskId);
  }

  //Método para criar uma nova tarefa
  static async createTask(taskData) {
    return await Task.create({
      title: taskData.title,
      userId: taskData.userId,
      activityId: taskData.activityId,
      tag: taskData.tag,
      dueDate: taskData.dueDate,
      image: taskData.image,
      generalDescription: taskData.generalDescription,
      securityDescription: taskData.securityDescription,
    });
  }
}

module.exports = TaskService;
