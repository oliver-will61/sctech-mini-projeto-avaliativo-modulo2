import { Router } from "express";
import { UserController } from "../controllers/UserController";

const userRoutes = Router();
const userController = new UserController();

userRoutes.get("/", (req, res) => userController.index(req, res));
userRoutes.get("/:id", (req, res) => userController.show(req, res));
userRoutes.post("/", (req, res) => userController.store(req, res));
userRoutes.put("/:id", (req, res) => userController.update(req, res));
userRoutes.delete("/:id", (req, res) => userController.delete(req, res));

export { userRoutes };
