//sever.js

const express = require("express");
const dotenv = require("dotenv");
const supabase = require("./network/supabaseClient");
const routes = require("./routes/index");

// Configura variáveis de ambiente
dotenv.config();

// Cria a aplicação Express
const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 5000;

// Middleware para parsear JSON
app.use(express.json({ limit: "10mb" }));

// Rotas
app.use("/api", routes);

// Inicializa o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
