"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const UserController_1 = require("../controllers/UserController");
const userRoutes = (0, express_1.Router)();
exports.userRoutes = userRoutes;
const userController = new UserController_1.UserController();
userRoutes.get("/", (req, res) => userController.index(req, res));
userRoutes.get("/:id", (req, res) => userController.show(req, res));
userRoutes.post("/", (req, res) => userController.store(req, res));
userRoutes.put("/:id", (req, res) => userController.update(req, res));
userRoutes.delete("/:id", (req, res) => userController.delete(req, res));
//# sourceMappingURL=user.routes.js.map