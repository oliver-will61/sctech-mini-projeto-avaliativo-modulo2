// Configuração da conexão com o banco de dados PostgreSQL via TypeORM
// Lê as credenciais das variáveis de ambiente definidas no .env

import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entities/User";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true, // Cria/atualiza tabelas automaticamente baseado nas entidades (usar apenas em dev)
  logging: true, // Loga todas as queries SQL executadas no console
  entities: [User], // Lista de entidades que o TypeORM deve mapear para tabelas
});
