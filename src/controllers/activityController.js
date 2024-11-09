// controller/activityController.js

const CustomError = require("../utils/customError");
const ActivityService = require("../services/activityService");

class ActivityController {
  // Método para buscar as opções de tarefas
  static async getActivitys(req, res) {
    try {
      //Busca a lista de atividades
      const activitys = await ActivityService.getActivitys();
      // Resposta de sucesso
      return res.status(200).json({
        status: "success",
        results: activitys,
      });
    } catch (error) {
      const statusCode = error instanceof CustomError ? error.statusCode : 500;
      return res.status(statusCode).json({
        status: "error",
        error: {
          message: error.message || "Ocorreu um erro desconhecido",
        },
      });
    }
  }
}
module.exports = ActivityController;
