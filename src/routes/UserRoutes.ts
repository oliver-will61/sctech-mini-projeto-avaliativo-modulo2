// Definição de todas as rotas da aplicação
// Cada rota mapeia um endpoint HTTP para um método de um controller

import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { AuthController } from "../controllers/AuthController";

const routes = Router();
const userController = new UserController();
const authController = new AuthController();

// Rotas de autenticação
routes.post("/auth/register", (req, res) => authController.register(req, res));
routes.post("/auth/login", (req, res) => authController.login(req, res));

// Rotas de gerenciamento de usuários (CRUD)
routes.get("/users", (req, res) => userController.index(req, res));
routes.get("/users/:id", (req, res) => userController.show(req, res));
routes.post("/users", (req, res) => userController.store(req, res));
routes.put("/users/:id", (req, res) => userController.update(req, res));
routes.delete("/users/:id", (req, res) => userController.delete(req, res));

export { routes };
