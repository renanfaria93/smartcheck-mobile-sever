// services/problemService.js

const Report = require("../models/reportModel");

class ReportService {
  // Método para buscar a lista de problemas
  static async getProblems() {
    return await Report.getProblems();
  }

  // Método para criar um reporte
  static async createReport(reportData) {
    // Verifica a existência do task_id e problem_id antes da inserção
    await Report.checkTaskExists(reportData.taskId);
    await Report.checkProblemExists(reportData.problemId);

    return await Report.create({
      taskId: reportData.taskId,
      problemId: reportData.problemId,
      description: reportData.description,
    });
  }
}

module.exports = ReportService;
