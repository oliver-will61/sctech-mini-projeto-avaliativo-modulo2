"use strict";
// Controller responsável por receber as requisições HTTP do usuário
// Extrai os dados da request, chama o service e retorna a response
// Não contém lógica de negócio — apenas orquestra service e resposta HTTP
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const UserService_1 = require("../services/UserService");
class UserController {
    constructor() {
        this.userService = new UserService_1.UserService();
    }
    // GET /users — lista todos os usuários
    async index(req, res) {
        const users = await this.userService.findAll();
        return res.json(users);
    }
    // GET /users/:id — retorna um usuário pelo ID
    async show(req, res) {
        const user = await this.userService.findById(req.params.id);
        return res.json(user);
    }
    // POST /users — cria um novo usuário
    async store(req, res) {
        const { name, email, password, role } = req.body;
        const user = await this.userService.create({ name, email, password, role });
        return res.status(201).json(user);
    }
    // PUT /users/:id — atualiza um usuário
    async update(req, res) {
        const user = await this.userService.update(req.params.id, req.body);
        return res.json(user);
    }
    // DELETE /users/:id — remove um usuário
    async delete(req, res) {
        await this.userService.delete(req.params.id);
        return res.status(204).send();
    }
}
exports.UserController = UserController;
//# sourceMappingURL=UserController.js.map