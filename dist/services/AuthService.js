"use strict";
// Service responsável pela autenticação de usuários
// Contém a validação de login e geração de token JWT
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserRepository_1 = require("../repositories/UserRepository");
const AppError_1 = require("../utils/AppError");
class AuthService {
    constructor() {
        this.userRepository = new UserRepository_1.UserRepository();
    }
    // Valida as credenciais do usuário e retorna um token JWT
    // Em caso de credenciais inválidas, retorna erro 401 genérico
    async login(data) {
        const { email, password } = data;
        // Verifica se os campos foram preenchidos
        if (!email || !password) {
            throw new AppError_1.AppError("Email and password are required", 400);
        }
        // Busca o usuário pelo e-mail incluindo a senha (select: false na entidade)
        const user = await this.userRepository.findByEmailWithPassword(email);
        // Se não encontrar ou a senha não bater, retorna erro genérico (não informa qual campo)
        if (!user) {
            throw new AppError_1.AppError("Invalid credentials", 401);
        }
        const passwordMatch = await bcrypt_1.default.compare(password, user.password);
        if (!passwordMatch) {
            throw new AppError_1.AppError("Invalid credentials", 401);
        }
        // Gera o token JWT com id e role do usuário  
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION || "1d" });
        // Remove a senha do retorno
        const { password: _, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, token };
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=AuthService.js.map