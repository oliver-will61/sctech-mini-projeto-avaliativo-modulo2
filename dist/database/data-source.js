"use strict";
// Configuração da conexão com o banco de dados PostgreSQL via TypeORM
// Lê as credenciais das variáveis de ambiente definidas no .env
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const User_1 = require("../entities/User");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false, // Cria/atualiza tabelas automaticamente baseado nas entidades (usar apenas em dev)
    logging: true, // Loga todas as queries SQL executadas no console
    entities: [User_1.User], // Lista de entidades que o TypeORM deve mapear para tabelas
});
//# sourceMappingURL=data-source.js.map