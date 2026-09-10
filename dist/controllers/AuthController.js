"use strict";
// Controller responsável por receber as requisições HTTP de autenticação
// Extrai os dados da request, chama o AuthService e retorna a response
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const AuthService_1 = require("../services/AuthService");
class AuthController {
    constructor() {
        this.authService = new AuthService_1.AuthService();
    }
    // POST /auth/register — cadastra um novo usuário no sistema
    async register(req, res) {
        const { name, email, password } = req.body;
        const user = await this.authService.register({ name, email, password });
        return res.status(201).json(user);
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map