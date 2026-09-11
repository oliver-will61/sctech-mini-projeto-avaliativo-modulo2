// Definição de todas as rotas da aplicação
// Cada rota mapeia um endpoint HTTP para um método de um controller

import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { AuthController } from "../controllers/AuthController";
import { validaToken } from "../middlewares/validaToken";
import { authorizeRole } from "../middlewares/authorizeRole";
import { UserRole } from "../entities/User";

const routes = Router();
const userController = new UserController();
const authController = new AuthController();

// Rotas públicas (não requerem autenticação)
routes.post("/auth/register", (req, res) => authController.register(req, res));
routes.post("/auth/login", (req, res) => authController.login(req, res));

// Rotas protegidas (requerem token JWT válido)
// RBAC: leitura permitida para Admin e Atendente; escrita/exclusão apenas para Admin
routes.get(
  "/users",
  validaToken,
  authorizeRole(UserRole.ADMIN, UserRole.ATTENDANT),
  (req, res) => userController.index(req, res)
);
routes.get(
  "/users/:id",
  validaToken,
  authorizeRole(UserRole.ADMIN, UserRole.ATTENDANT),
  (req, res) => userController.show(req, res)
);
routes.post(
  "/users",
  validaToken,
  authorizeRole(UserRole.ADMIN),
  (req, res) => userController.store(req, res)
);
routes.put(
  "/users/:id",
  validaToken,
  authorizeRole(UserRole.ADMIN),
  (req, res) => userController.update(req, res)
);
routes.delete(
  "/users/:id",
  validaToken,
  authorizeRole(UserRole.ADMIN),
  (req, res) => userController.delete(req, res)
);

export { routes };
