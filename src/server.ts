// Ponto de entrada da aplicação
// Carrega as variáveis de ambiente, configura o Express e conecta ao banco de dados

import "dotenv/config";
import express from "express";
import { AppDataSource } from "./database/data-source";
import { routes } from "./routes/UserRoutes";
import { errorHandler } from "./middlewares/errorHandler";

// Instância do Express
const app = express();

// Porta do servidor (usa variável de ambiente ou 3000 como padrão)
const PORT = process.env.PORT || 3000;

// Middleware para interpretar JSON no corpo das requisições
app.use(express.json());

// Registra as rotas da aplicação
app.use(routes);

// Middleware global de tratamento de erros (deve ser registrado após as rotas)
app.use(errorHandler);

// Inicializa a conexão com o banco de dados antes de subir o servidor
AppDataSource.initialize()
  .then(() => {
    console.log("Database connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1);
  });
