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

  // Método para obter o usuário com menos tarefas pendentes ou atrasadas para uma atividade específica
  static async getUserWithLeastTasks(activityId) {
    const { data, error } = await supabase.rpc("get_user_with_least_tasks", {
      p_activity_id: activityId,
    });

    if (error || !data) {
      throw new Error("Nenhum usuário disponível para essa atividade.");
    }

    return data; // Retorna o user_id do usuário com menos tarefas
  }

  // Método estático para criar uma nova tarefa
  static async create(task) {
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

  // Método para verificar a tarefa antes de iniciar
  static async checkTaskBeforeToStart(taskId, userId) {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", taskId)
      .single();

    if (error || !data) {
      throw new Error("Erro ao buscar os dados da tarefa.");
    }

    if (data.status == "reported") {
      throw new Error("Esta tarefa esta reportada, não é possivel iniciar");
    }

    if (data.status == "finished") {
      throw new Error("Esta tarefa esta finalizada");
    }

    if (data.user_id != userId) {
      throw new Error("Esta tarefa não pertence a este usuário");
    }
  }

  // Método estático para atualizar uma tarefa
  static async update(taskId, updatedData) {
    const { data, error } = await supabase
      .from("tasks")
      .update([
        {
          title: updatedData.title,
          activity_id: updatedData.activityId,
          tag: updatedData.tag,
          due_date: updatedData.dueDate,
          image: updatedData.image,
          general_description: updatedData.generalDescription,
          security_description: updatedData.securityDescription,
        },
      ])
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
      .limit(1);

    if (error) {
      throw new Error("Erro ao buscar a tarefa: " + error.message);
    }

    return data[0];
  }

  // Método estático para encontrar uma tarefa em processo por ID de usuário
  static async findTaskInProgressById(taskLogId) {
    const { data, error } = await supabase
      .from("user_task_log")
      .select("*")
      .eq("id", taskLogId)
      .single();

    if (error || !data) {
      throw new Error("Erro ao verificar log da tarefa: " + error.message);
    }

    if (!data.in_progress) {
      throw new Error("Esta tarefa está finalizada.");
    }

    return data;
  }

  // Método estático para verificar se um log existe pelo ID
  static async checkLogExists(id) {
    const { data, error } = await supabase
      .from("user_task_log")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error("Esta tarefa ainda não foi iniciada");
    }

    return data;
  }

  // Método estático para verificar se a tarefa está em progresso
  static async checkIfTaskInProgress(id) {
    const { data, error } = await supabase
      .from("user_task_log")
      .select("in_progress")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error("Erro ao verificar a tarefa: " + error.message);
    }

    // Verifica o valor do campo in_progress
    if (!data || data.in_progress === false) {
      throw new Error("Esta tarefa já foi finalizada");
    }

    return data;
  }

  // Método para iniciar uma tarefa
  static async createTaskLog(taskId, userId) {
    const { data, error } = await supabase
      .from("user_task_log")
      .insert([
        {
          task_id: taskId,
          user_id: userId,
        },
      ])
      .select()
      .single();

    if (error) {
      throw new Error("Erro ao criar o iniciar a tarefa: " + error.message);
    }

    return data;
  }

  // Método para atualizar o log da tarefa
  static async updateTaskLogStatus(id, image) {
    const { data, error } = await supabase
      .from("user_task_log")
      .update({
        image: image,
        finished_at: new Date().toISOString(),
        in_progress: false,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error("Erro ao atualizar o registro: " + error.message);
    }
    return data;
  }
}

module.exports = Task;
