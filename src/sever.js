const express = require("express");
const dotenv = require("dotenv");
const supabase = require("./services/supabaseClient");
const routes = require("./routes");

// Configura variáveis de ambiente
dotenv.config();

// Cria a aplicação Express
const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 5000;

// Middleware para parsear JSON
app.use(express.json());

// Rotas
app.use("/api", routes);

// Inicializa o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
