const { supabase } = require("../network/supabaseClient");

class Report {
  constructor(taskId, problemId, description) {
    this.taskId = taskId;
    this.problemId = problemId;
    this.description = description;
  }

  // Método estático para verificar a existência do task_id
  static async checkTaskExists(taskId) {
    const { data, error } = await supabase
      .from("tasks")
      .select("id")
      .eq("id", taskId)
      .single();

    if (error || !data) {
      throw new Error("Tarefa (task_id) não encontrada.");
    }
  }

  // Método estático para verificar a existência do problem_id
  static async checkProblemExists(problemId) {
    const { data, error } = await supabase
      .from("problems")
      .select("id")
      .eq("id", problemId)
      .single();

    if (error || !data) {
      throw new Error("Problema (problem_id) não encontrado.");
    }
  }

  // Método estático para buscar a lista de problemas
  static async getProblems() {
    const { data, error } = await supabase.from("problems").select("*");

    if (error) {
      throw new Error("Erro ao buscar os problemas: " + error.message);
    }

    return data;
  }

  // Método estático para criar um reporte, incluindo verificações das chaves estrangeiras
  static async create(report) {
    const { data, error } = await supabase
      .from("reports")
      .insert([
        {
          task_id: report.taskId,
          problem_id: report.problemId,
          description: report.description,
        },
      ])
      .select();

    if (error) {
      throw new Error("Erro ao reportar a tarefa: " + error.message);
    }

    return data[0];
  }
}

module.exports = Report;
