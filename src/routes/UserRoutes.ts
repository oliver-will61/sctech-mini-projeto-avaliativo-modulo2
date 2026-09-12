// Definição de todas as rotas da aplicação
// Cada rota mapeia um endpoint HTTP para um método de um controller

import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { AuthController } from "../controllers/AuthController";
import { validaToken } from "../middlewares/validaToken";
import { validaRole } from "../middlewares/validaRole";
import { UserRole } from "../entities/User";
import { asyncHandler } from "../utils/asyncHandler";

const routes = Router();
const userController = new UserController();
const authController = new AuthController();

// Rotas públicas (não requerem autenticação)
routes.post("/auth/login", asyncHandler((req, res) => authController.login(req, res)));

// Rotas protegidas (requerem token JWT válido)
// RBAC: leitura permitida para Admin e Atendente; escrita/exclusão apenas para Admin
routes.get(
  "/users",
  validaToken,
  validaRole(UserRole.ADMIN, UserRole.ATTENDANT),
  asyncHandler((req, res) => userController.index(req, res))
);
routes.get(
  "/users/:id",
  validaToken,
  validaRole(UserRole.ADMIN, UserRole.ATTENDANT),
  asyncHandler((req, res) => userController.show(req, res))
);
routes.post(
  "/users",
  validaToken,
  validaRole(UserRole.ADMIN),
  asyncHandler((req, res) => userController.store(req, res))
);
routes.put(
  "/users/:id",
  validaToken,
  validaRole(UserRole.ADMIN),
  asyncHandler((req, res) => userController.update(req, res))
);
routes.delete(
  "/users/:id",
  validaToken,
  validaRole(UserRole.ADMIN),
  asyncHandler((req, res) => userController.delete(req, res))
);

export { routes };
