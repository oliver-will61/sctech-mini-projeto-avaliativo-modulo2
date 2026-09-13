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
    // POST /auth/login — valida credenciais e retorna token JWT
    async login(req, res) {
        const { email, password } = req.body;
        const dto = { email, password };
        const result = await this.authService.login(dto);
        return res.json(result);
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map