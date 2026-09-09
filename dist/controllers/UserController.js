"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const UserService_1 = require("../services/UserService");
class UserController {
    constructor() {
        this.userService = new UserService_1.UserService();
    }
    async index(req, res) {
        const users = await this.userService.findAll();
        return res.json(users);
    }
    async show(req, res) {
        const user = await this.userService.findById(req.params.id);
        return res.json(user);
    }
    async store(req, res) {
        const { name, email, password, role } = req.body;
        const user = await this.userService.create({ name, email, password, role });
        return res.status(201).json(user);
    }
    async update(req, res) {
        const user = await this.userService.update(req.params.id, req.body);
        return res.json(user);
    }
    async delete(req, res) {
        await this.userService.delete(req.params.id);
        return res.status(204).send();
    }
}
exports.UserController = UserController;
//# sourceMappingURL=UserController.js.map