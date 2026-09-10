"use strict";
// Ponto de entrada da aplicação
// Carrega as variáveis de ambiente, configura o Express e conecta ao banco de dados
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const data_source_1 = require("./database/data-source");
const UserRoutes_1 = require("./routes/UserRoutes");
const errorHandler_1 = require("./middlewares/errorHandler");
// Instância do Express
const app = (0, express_1.default)();
// Porta do servidor (usa variável de ambiente ou 3000 como padrão)
const PORT = process.env.PORT || 3000;
// Middleware para interpretar JSON no corpo das requisições
app.use(express_1.default.json());
// Registra as rotas da aplicação
app.use(UserRoutes_1.routes);
// Middleware global de tratamento de erros (deve ser registrado após as rotas)
app.use(errorHandler_1.errorHandler);
// Inicializa a conexão com o banco de dados antes de subir o servidor
data_source_1.AppDataSource.initialize()
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
//# sourceMappingURL=server.js.map