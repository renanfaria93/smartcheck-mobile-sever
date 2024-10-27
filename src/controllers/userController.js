// controller/userController.js

const CustomError = require("../utils/customError");
const UserService = require("../services/userService");
const nodemailer = require("nodemailer");

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

  // // Método para reenviar o código de verificação
  // static async resendCode(req, res) {
  //   const { email } = req.body;

  //   // Validação dos campos obrigatórios
  //   if (!email) {
  //     return res.status(400).json({
  //       status: "error",
  //       results: "Parametro email inválido",
  //     });
  //   }

  //   try {
  //     // Reenviar o código de confirmação
  //     await UserService.resendConfirmationCode(email);

  //     return res.status(200).json({
  //       status: "success",
  //       results: {
  //         message:
  //           "Um novo código de confirmação foi enviado para o seu e-mail.",
  //       },
  //     });
  //   } catch (error) {
  //     const statusCode = error instanceof CustomError ? error.statusCode : 500;
  //     return res.status(statusCode).json({
  //       status: "error",
  //       results: {
  //         message: error.message || "Ocorreu um erro desconhecido.",
  //       },
  //     });
  //   }
  // }

  // Método para validar o email através do código
  static async validateEmail(req, res) {
    const { email, code } = req.body;

    //Validar o campos
    if (!email || !code) {
      return res.status(400).json({
        status: "error",
        error: {
          message: "Parâmetro código ou email inválido",
        },
      });
    }

    try {
      const data = await UserService.validateEmail(email, code);
      // Resposta de sucesso
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
          message: "Parâmetro de email ou senha inválidos",
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
      // Tratar erro de email ou senha incorretos
      return res.status(404).json({
        status: "error",
        error: {
          message: error.message,
        },
      });
    }
  }
}

module.exports = UserController;
