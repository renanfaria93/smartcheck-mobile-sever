// controller/userController.js

const CustomError = require("../utils/customError");
const UserService = require("../services/userService");
const { validate: validateUUID } = require("uuid");

// Função auxiliar para validar o formato do e-mail
const validateEmailFormat = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

class UserController {
  // Método para registrar um usuário
  static async register(req, res) {
    const { name, email, password } = req.body;

    // Validação dos campos obrigatórios
    if (!name || !email || !password) {
      return res.status(400).json({
        status: "error",
        error: {
          message: "Todos os campos são obrigatórios.",
        },
      });
    }

    // Valida o tamanho do campo `name`
    if (name.length > 50) {
      return res.status(400).json({
        status: "error",
        error: {
          message: "O nome não pode ter mais de 50 caracteres.",
        },
      });
    }

    // Validação do formato do email
    if (!validateEmailFormat(email)) {
      return res.status(400).json({
        status: "error",
        error: {
          message: "O formato do e-mail é inválido.",
        },
      });
    }

    // Validação do tamanho da senha
    if (password.length < 6) {
      return res.status(400).json({
        status: "error",
        error: {
          message: "A senha deve ter pelo menos 6 caracteres.",
        },
      });
    }

    try {
      // Cria o usuário e envia o e-mail de confirmação (delegado ao serviço)
      const newUser = await UserService.registerUser({ name, email, password });

      return res.status(201).json({
        status: "success",
        results: {
          message:
            "Usuário registrado com sucesso! Verifique seu e-mail para o código de confirmação.",
        },
      });
    } catch (error) {
      const statusCode = error instanceof CustomError ? error.statusCode : 500;
      return res.status(statusCode).json({
        status: "error",
        error: {
          message: error.message || "Ocorreu um erro desconhecido.",
        },
      });
    }
  }

  // Método para validar o email através do código
  static async validateEmail(req, res) {
    const { email, code } = req.body;

    // Validação dos campos obrigatórios
    if (!email || !code) {
      return res.status(400).json({
        status: "error",
        error: {
          message: "Parâmetro código ou email inválido.",
        },
      });
    }

    // Validação do formato do email
    if (!validateEmailFormat(email)) {
      return res.status(400).json({
        status: "error",
        error: {
          message: "O formato do e-mail é inválido.",
        },
      });
    }

    // Validação do comprimento do código de confirmação (6 caracteres)
    if (code.length !== 6) {
      return res.status(400).json({
        status: "error",
        error: {
          message: "O código de confirmação deve ter 6 caracteres.",
        },
      });
    }

    try {
      const data = await UserService.validateEmail(email, code);
      return res.status(200).json({
        status: "success",
        results: data,
      });
    } catch (error) {
      const statusCode = error instanceof CustomError ? error.statusCode : 500;
      return res.status(statusCode).json({
        status: "error",
        error: {
          message: error.message || "Ocorreu um erro desconhecido.",
        },
      });
    }
  }

  // Método para realizar o login
  static async login(req, res) {
    const { email, password } = req.body;

    // Validação dos campos obrigatórios
    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        error: {
          message: "Parâmetro de email ou senha inválidos.",
        },
      });
    }

    // Validação do formato do email
    if (!validateEmailFormat(email)) {
      return res.status(400).json({
        status: "error",
        error: {
          message: "O formato do e-mail é inválido.",
        },
      });
    }

    try {
      // Chama o serviço de login
      const data = await UserService.login({ email, password });

      // Caso o email não esteja verificado
      if (!data) {
        return res.status(401).json({
          status: "not_verified",
          error: {
            message:
              "Email não verificado. Enviando novo código de confirmação.",
          },
        });
      }

      // Caso o login seja bem-sucedido
      return res.status(200).json({
        status: "success",
        results: data,
      });
    } catch (error) {
      return res.status(404).json({
        status: "error",
        error: {
          message: error.message,
        },
      });
    }
  }

  // Método buscar usuários
  static async getUsers(req, res) {
    try {
      // Chama o serviço de login
      const users = await UserService.getUsers();

      return res.status(200).json({
        status: "success",
        results: users,
      });
    } catch (error) {
      const statusCode = error instanceof CustomError ? error.statusCode : 500;
      return res.status(statusCode).json({
        status: "error",
        error: {
          message: error.message || "Ocorreu um erro desconhecido.",
        },
      });
    }
  }

  // Método buscar usuários
  static async getUserData(req, res) {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        status: "error",
        error: {
          message: "Parâmetro userId inválido.",
        },
      });
    }
    try {
      // Chama o serviço de usuário
      const userData = await UserService.getUserData(userId);

      return res.status(200).json({
        status: "success",
        results: userData,
      });
    } catch (error) {
      const statusCode = error instanceof CustomError ? error.statusCode : 500;
      return res.status(statusCode).json({
        status: "error",
        error: {
          message: error.message || "Ocorreu um erro desconhecido.",
        },
      });
    }
  }

  // Método buscar status do usuário
  static async me(req, res) {
    const { userId } = req.params;

    // Validação dos campos obrigatórios
    if (!userId) {
      return res.status(400).json({
        status: "error",
        error: {
          message: "Parâmetro userId inválido.",
        },
      });
    }

    try {
      // Chama o serviço de login
      const data = await UserService.me(userId);

      return res.status(200).json({
        status: "success",
        results: data,
      });
    } catch (error) {
      const statusCode = error instanceof CustomError ? error.statusCode : 500;
      return res.status(statusCode).json({
        status: "error",
        error: {
          message: error.message || "Ocorreu um erro desconhecido.",
        },
      });
    }
  }

  // Método para atualizar os dados do usuário
  static async updateUserData(req, res) {
    const { userId } = req.params;
    const { user, assignment } = req.body;

    // Validação dos campos obrigatórios
    if (!userId) {
      return res.status(400).json({
        status: "error",
        error: {
          message: "Parâmetro userId inválido.",
        },
      });
    }

    if (!user || !user.id || !user.role) {
      return res.status(400).json({
        status: "error",
        error: {
          message:
            "Dados do usuário inválidos. É necessário informar 'id' e 'role'.",
        },
      });
    }

    if (!assignment || !assignment.activity) {
      return res.status(400).json({
        status: "error",
        error: {
          message:
            "Dados de atribuição inválidos. É necessário informar 'id' e 'activity'.",
        },
      });
    }

    // Validação do UUID do userId
    if (!validateUUID(user.id)) {
      return res.status(400).json({
        status: "error",
        error: { message: "O user id deve ser um UUID válido." },
      });
    }

    // Validação do UUID do assignment id
    if (assignment.id && !validateUUID(assignment.id)) {
      return res.status(400).json({
        status: "error",
        error: { message: "O assignment id deve ser um UUID válido." },
      });
    }

    // Validação do UUID do activity id
    if (!validateUUID(assignment.activity)) {
      return res.status(400).json({
        status: "error",
        error: { message: "O assignment activity deve ser um UUID válido." },
      });
    }

    // Construção do objeto `data`
    const data = {
      user: {
        id: user.id,
        role: user.role,
      },
      assignment: {
        id: assignment.id,
        user: user.id,
        activity: assignment.activity,
      },
    };

    try {
      // Chama o serviço de atualização com os dados validados
      const result = await UserService.updateUserData(data);

      if (result) {
        return res.status(200).json({
          status: "success",
          results: result,
        });
      }

      return res.status(201).json({
        status: "success",
        results: "OK",
      });
    } catch (error) {
      const statusCode = error instanceof CustomError ? error.statusCode : 500;
      return res.status(statusCode).json({
        status: "error",
        error: {
          message: error.message || "Ocorreu um erro desconhecido.",
        },
      });
    }
  }
}

module.exports = UserController;
