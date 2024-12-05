const bcrypt = require("bcrypt");
const { supabase } = require("../network/supabaseClient");

class User {
  constructor(name, email, password, role = "user", confirmation_code = null) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
    this.confirmation_code = confirmation_code;
  }

  // Método para verificar a existência do e-mail no banco de dados
  static async checkEmailExists(email) {
    const { data, error } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (data) {
      throw new Error("O e-mail já está cadastrado.");
    }
    if (error) {
      throw new Error("Erro ao verificar e-mail: " + error.message);
    }
  }

  // Método para verificar a existência do usuário
  static async checkUserExists(userId) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error || !data) {
      throw new Error("Usuário (userId) não encontrado.");
    }
    return data;
  }

  // Método estático para criar um novo usuário no banco de dados
  static async create(user) {
    // Verificações de e-mail
    await this.checkEmailExists(user.email);

    // Hash da senha e geração de código de confirmação
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const confirmationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          name: user.name,
          email: user.email,
          password: hashedPassword,
          role: user.role || "user",
          confirmation_code: confirmationCode,
        },
      ])
      .select();

    if (error) {
      throw new Error("Erro ao cadastrar usuário: " + error.message);
    }

    return data[0];
  }

  // Método estático para criar um novo usuário no banco de dados
  static async getUsers() {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("is_verified", true)
      .order("name", { ascending: true });

    if (error) {
      throw new Error("Erro ao buscar os usuários: " + error.message);
    }

    return data;
  }

  // Método estático para criar um novo usuário no banco de dados
  static async getUserActivity(userId) {
    const { data, error } = await supabase
      .from("user_activitys")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error || !data) {
      return null;
    }

    return data;
  }

  // Método estático para atualizar o código de confirmação
  static async updateConfirmationCode(userId, newCode) {
    const { error } = await supabase
      .from("users")
      .update({ confirmation_code: newCode })
      .eq("id", userId);

    if (error) {
      throw new Error(
        "Erro ao atualizar código de confirmação: " + error.message
      );
    }
  }

  // Método estático para encontrar um usuário por e-mail
  static async findByEmail(email) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !data) {
      throw new Error("Usuário não encontrado.");
    }

    return data;
  }

  // Método estático para confirmar o email do usuário
  static async validateEmail(email, confirmationCode) {
    const { data, error } = await supabase
      .from("users")
      .update({ is_verified: true })
      .eq("email", email)
      .eq("confirmation_code", confirmationCode)
      .select();

    if (error || data.length === 0) {
      throw new Error(
        "Código de confirmação inválido ou e-mail não encontrado."
      );
    }

    return data;
  }

  // Método estático para encontrar uma tarefa em processo por ID de usuário
  static async findTaskInProgressById(userId) {
    const { data, error } = await supabase
      .from("user_task_log")
      .select("*")
      .eq("user_id", userId)
      .eq("in_progress", true)
      .limit(1);

    if (error) {
      throw new Error("Erro ao verificar log do usuário: " + error.message);
    }

    return data[0];
  }

  // Método estático para atualizar um registro na tabela user_task_log
  static async updateTaskLogStatus(id) {
    const { data, error } = await supabase
      .from("user_task_log")
      .update({
        finished_at: new Date().toISOString(),
        in_progress: false,
      })
      .eq("id", id)
      .single();

    if (error) {
      throw new Error("Erro ao atualizar o registro: " + error.message);
    }

    return data;
  }
}

module.exports = User;
