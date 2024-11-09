// controller/reportController.js

const CustomError = require("../utils/customError");
const ReportService = require("../services/reportService");
const { validate: validateUUID } = require("uuid");

class ReportController {
  // Método para buscar a lista de problemas
  static async getProblems(req, res) {
    try {
      const problems = await ReportService.getProblems();
      return res.status(200).json({
        status: "success",
        results: problems,
      });
    } catch (error) {
      const statusCode = error instanceof CustomError ? error.statusCode : 500;
      return res.status(statusCode).json({
        status: "error",
        error: { message: error.message || "Ocorreu um erro desconhecido" },
      });
    }
  }

  // Método para criar um reporte
  static async createReport(req, res) {
    const { taskId, problemId, description, created_at } = req.body;

    // Verificação dos campos obrigatórios
    if (!taskId || !problemId || !description) {
      return res.status(400).json({
        status: "error",
        error: {
          message:
            "Os campos taskId, problemId e description são obrigatórios.",
        },
      });
    }

    // Verifica se taskId e problemId são UUIDs válidos
    if (!validateUUID(taskId) || !validateUUID(problemId)) {
      return res.status(400).json({
        status: "error",
        error: { message: "taskId e problemId devem ser UUIDs válidos." },
      });
    }

    // Verifica se description tem comprimento máximo de 500 caracteres
    if (description.length > 500) {
      return res.status(400).json({
        status: "error",
        error: { message: "A descrição não pode ter mais de 500 caracteres." },
      });
    }

    // Validação do campo created_at (se fornecido)
    if (created_at) {
      const createdAtTimestamp = new Date(created_at);
      const now = new Date();

      // Verifica se created_at é uma data válida
      if (isNaN(createdAtTimestamp.getTime())) {
        return res.status(400).json({
          status: "error",
          error: { message: "created_at deve ser uma data válida." },
        });
      }

      // Verifica se created_at não é uma data no futuro
      if (createdAtTimestamp > now) {
        return res.status(400).json({
          status: "error",
          error: { message: "created_at não pode ser uma data no futuro." },
        });
      }
    }

    try {
      const report = await ReportService.createReport({
        taskId,
        problemId,
        description,
        created_at,
      });

      return res.status(201).json({
        status: "success",
        data: report,
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

module.exports = ReportController;
