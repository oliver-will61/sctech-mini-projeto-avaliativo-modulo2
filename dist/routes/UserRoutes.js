"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = require("express");
const UserController_1 = require("../controllers/UserController");
const routes = (0, express_1.Router)();
exports.routes = routes;
const userController = new UserController_1.UserController();
routes.get("/users", (req, res) => userController.index(req, res));
routes.get("/users/:id", (req, res) => userController.show(req, res));
routes.post("/users", (req, res) => userController.store(req, res));
routes.put("/users/:id", (req, res) => userController.update(req, res));
routes.delete("/users/:id", (req, res) => userController.delete(req, res));
//# sourceMappingURL=UserRoutes.js.map