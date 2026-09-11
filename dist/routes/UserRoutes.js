"use strict";
// Definição de todas as rotas da aplicação
// Cada rota mapeia um endpoint HTTP para um método de um controller
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = require("express");
const UserController_1 = require("../controllers/UserController");
const AuthController_1 = require("../controllers/AuthController");
const validaToken_1 = require("../middlewares/validaToken");
const routes = (0, express_1.Router)();
exports.routes = routes;
const userController = new UserController_1.UserController();
const authController = new AuthController_1.AuthController();
// Rotas públicas (não requerem autenticação)
routes.post("/auth/register", (req, res) => authController.register(req, res));
routes.post("/auth/login", (req, res) => authController.login(req, res));
// Rotas protegidas (requerem token JWT válido)
routes.get("/users", validaToken_1.validaToken, (req, res) => userController.index(req, res));
routes.get("/users/:id", validaToken_1.validaToken, (req, res) => userController.show(req, res));
routes.post("/users", validaToken_1.validaToken, (req, res) => userController.store(req, res));
routes.put("/users/:id", validaToken_1.validaToken, (req, res) => userController.update(req, res));
routes.delete("/users/:id", validaToken_1.validaToken, (req, res) => userController.delete(req, res));
//# sourceMappingURL=UserRoutes.js.map