// models/userModel.js

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

  // Método estático para criar um novo usuário no banco de dados
  static async create(user) {
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
}

module.exports = User;
