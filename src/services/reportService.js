// services/problemService.js

const Report = require("../models/reportModel");

class ReportService {
  // Método para buscar a lista de problemas
  static async getProblems() {
    return await Report.getProblems();
  }

  // Método para criar um reporte
  static async createReport(reportData) {
    return await Report.create({
      taskId: reportData.taskId,
      problemId: reportData.problemId,
      description: reportData.description,
    });
  }
}

module.exports = ReportService;
