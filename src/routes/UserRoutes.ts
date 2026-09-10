import { Router } from "express";
import { UserController } from "../controllers/UserController";

const routes = Router();
const userController = new UserController();

routes.get("/users", (req, res) => userController.index(req, res));
routes.get("/users/:id", (req, res) => userController.show(req, res));
routes.post("/users", (req, res) => userController.store(req, res));
routes.put("/users/:id", (req, res) => userController.update(req, res));
routes.delete("/users/:id", (req, res) => userController.delete(req, res));

export { routes };
