const { supabase } = require("../network/supabaseClient");

class Task {
  constructor(
    title,
    userId,
    activityId,
    tag = null,
    dueDate = null,
    image = null,
    generalDescription = null,
    securityDescription = null,
    status = null
  ) {
    this.title = title;
    this.userId = userId;
    this.activityId = activityId;
    this.tag = tag;
    this.dueDate = dueDate;
    this.image = image;
    this.generalDescription = generalDescription;
    this.securityDescription = securityDescription;
    this.status = status;
  }

  // Método para verificar a existência do usuário
  static async checkUserExists(userId) {
    const { data, error } = await supabase
      .from("users")
      .select("id")
      .eq("id", userId)
      .single();

    if (error || !data) {
      throw new Error("Usuário (user_id) não encontrado.");
    }
  }

  // Método para verificar a existência da atividade
  static async checkActivityExists(activityId) {
    const { data, error } = await supabase
      .from("activitys")
      .select("id")
      .eq("id", activityId)
      .single();

    if (error || !data) {
      throw new Error("Atividade (activity_id) não encontrada.");
    }
  }

  // Método para verificar o vínculo entre o usuário e a atividade
  static async checkUserActivityLink(userId, activityId) {
    const { data, error } = await supabase
      .from("user_activitys")
      .select("id")
      .eq("user_id", userId)
      .eq("activity_id", activityId)
      .single();

    if (error || !data) {
      throw new Error("O usuário não está vinculado a essa atividade.");
    }
  }

  // Método estático para criar uma nova tarefa
  static async create(task) {
    // Verificações de existência e vínculo antes da inserção
    await this.checkUserExists(task.userId);
    await this.checkActivityExists(task.activityId);
    await this.checkUserActivityLink(task.userId, task.activityId);

    const { data, error } = await supabase
      .from("tasks")
      .insert([
        {
          title: task.title,
          user_id: task.userId,
          activity_id: task.activityId,
          tag: task.tag,
          due_date: task.dueDate,
          image: task.image,
          general_description: task.generalDescription,
          security_description: task.securityDescription,
          status: task.status,
        },
      ])
      .select();

    if (error) {
      throw new Error("Erro ao criar tarefa: " + error.message);
    }

    return data[0];
  }

  // Método estático para buscar todas as tarefas
  static async getTasks() {
    const { data, error } = await supabase.from("tasks").select("*");

    if (error) {
      throw new Error("Erro ao buscar as tarefas: " + error.message);
    }

    return data;
  }

  // Método estático para buscar tarefas por ID de usuário
  static async getTasksByUserId(userId) {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      throw new Error("Erro ao buscar tarefas do usuário: " + error.message);
    }

    return data;
  }

  // Método estático para atualizar uma tarefa
  static async update(taskId, updatedData) {
    const { data, error } = await supabase
      .from("tasks")
      .update(updatedData)
      .eq("id", taskId)
      .select();

    if (error) {
      throw new Error("Erro ao atualizar tarefa: " + error.message);
    }

    return data[0];
  }

  // Método estático para deletar uma tarefa
  static async delete(taskId) {
    const { data, error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", taskId)
      .select();

    if (error) {
      throw new Error("Erro ao deletar tarefa: " + error.message);
    }

    return data[0];
  }

  // Método estático para buscar uma tarefa pelo ID
  static async findById(taskId) {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", taskId)
      .single();

    if (error) {
      throw new Error("Erro ao buscar a tarefa: " + error.message);
    }

    return data;
  }
}

module.exports = Task;
