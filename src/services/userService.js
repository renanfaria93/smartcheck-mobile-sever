// services/userService.js

const User = require("../models/userModel"); // Importe o modelo de usuário
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

class UserService {
  // Método para criar um novo usuário
  static async registerUser(userData) {
    // Delegar ao modelo a criação do usuário no banco de dados
    const user = await User.create(userData);

    // Enviar codigo de validação de email
    return await UserService.#sendValidationCode(
      user.email,
      user.confirmation_code
    );
  }

  // Método para confirmar o email cadastrado
  static async validateEmail(email, confirmationCode) {
    // Delegar ao modelo a confirmação do email
    const user = await User.validateEmail(email, confirmationCode);
    return {
      id: user[0].id,
      name: user[0].name,
      role: user[0].role,
    };
  }

  // Função privada para enviar um codigo de validação do email
  static async #sendValidationCode(email, confirmationCode) {
    const EMAIL_USER = process.env.EMAIL_USER || ""; // E-mail do administrador
    const EMAIL_PASS = process.env.EMAIL_PASS || ""; // Client Secret do Google

    // Verificar se as variáveis de ambiente estão definidas
    if (!EMAIL_USER || !EMAIL_PASS) {
      throw new Error(
        "As credenciais do e-mail não estão configuradas corretamente."
      );
    }

    // Configuração do transportador com sua conta Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    // Definir as opções de envio do e-mail
    const mailOptions = {
      from: "Smart Check Mobile <${EMAIL_USER}>",
      to: email,
      subject: "Confirmação de Cadastro",
      text: `Seu código de confirmação é: ${confirmationCode}`,
    };

    try {
      // Enviar o e-mail e verificar o resultado
      const info = await transporter.sendMail(mailOptions);
      return info;
    } catch (error) {
      throw new Error(`Erro ao enviar e-mail: ${error.message}`);
    }
  }

  // Método para realizar o login
  static async login(credentials) {
    // Verifica se o email esta cadastrado
    const user = await User.findByEmail(credentials.email);

    // Verificar se a senha está correta
    const passwordMatch = await bcrypt.compare(
      credentials.password,
      user.password
    );
    if (!passwordMatch) {
      throw new Error("Email ou senha incorretos.");
    }

    // Verifica o email, se nao foi validado reenvia o codigo
    if (!user.is_verified) {
      await UserService.#sendValidationCode(user.email, user.confirmation_code);
      return null;
    }

    // Monta o retorno balanceado
    const response = {
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
    };

    return response;
  }

  // Método para buscar status do usuários
  static async me(userId) {
    // Verifica se o usuário possui tarefa ativa
    const taskLog = await User.findTaskInProgressById(userId);

    // Monta o retorno balanceado
    const response = {
      taskLog: taskLog
        ? {
            id: taskLog.id,
            task_id: taskLog.task_id,
          }
        : null,
    };

    return response;
  }
}

module.exports = UserService;
