const supabase = require("../services/supabaseClient");
const CustomError = require("../utils/customError");

// Função que busca usuários no Supabase
async function getUsers(req, res) {
  try {
    const { data, error } = await supabase.from("users").select("*");

    if (error) {
      throw new CustomError(500, "Erro ao buscar usuários do Supabase.");
    }

    if (!data || data.length === 0) {
      throw new CustomError(404, "Nenhum usuário encontrado.");
    }

    // Resposta de sucesso com status 'success' e dados no campo 'results'
    return res.status(200).json({
      status: "success",
      results: data,
    });
  } catch (err) {
    const statusCode = err instanceof CustomError ? err.statusCode : 500;

    // Resposta de erro com status 'error' e mensagem no campo 'results'
    return res.status(statusCode).json({
      status: "error",
      results: err.message || "Ocorreu um erro desconhecido.",
    });
  }
}

module.exports = { getUsers };
