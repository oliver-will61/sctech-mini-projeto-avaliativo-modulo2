"use strict";
// Definição de todas as rotas da aplicação
// Cada rota mapeia um endpoint HTTP para um método de um controller
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = require("express");
const UserController_1 = require("../controllers/UserController");
const AuthController_1 = require("../controllers/AuthController");
const validaToken_1 = require("../middlewares/validaToken");
const validaRole_1 = require("../middlewares/validaRole");
const User_1 = require("../entities/User");
const asyncHandler_1 = require("../utils/asyncHandler");
const routes = (0, express_1.Router)();
exports.routes = routes;
const userController = new UserController_1.UserController();
const authController = new AuthController_1.AuthController();
// Rotas públicas (não requerem autenticação)
routes.post("/auth/login", (0, asyncHandler_1.asyncHandler)((req, res) => authController.login(req, res)));
// Rotas protegidas (requerem token JWT válido)
// RBAC: leitura permitida para Admin e Atendente; escrita/exclusão apenas para Admin
routes.get("/users", validaToken_1.validaToken, (0, validaRole_1.validaRole)(User_1.UserRole.ADMIN, User_1.UserRole.ATTENDANT), (0, asyncHandler_1.asyncHandler)((req, res) => userController.index(req, res)));
routes.get("/users/:id", validaToken_1.validaToken, (0, validaRole_1.validaRole)(User_1.UserRole.ADMIN, User_1.UserRole.ATTENDANT), (0, asyncHandler_1.asyncHandler)((req, res) => userController.show(req, res)));
routes.post("/users", validaToken_1.validaToken, (0, validaRole_1.validaRole)(User_1.UserRole.ADMIN), (0, asyncHandler_1.asyncHandler)((req, res) => userController.store(req, res)));
routes.put("/users/:id", validaToken_1.validaToken, (0, validaRole_1.validaRole)(User_1.UserRole.ADMIN), (0, asyncHandler_1.asyncHandler)((req, res) => userController.update(req, res)));
routes.delete("/users/:id", validaToken_1.validaToken, (0, validaRole_1.validaRole)(User_1.UserRole.ADMIN), (0, asyncHandler_1.asyncHandler)((req, res) => userController.delete(req, res)));
//# sourceMappingURL=UserRoutes.js.map