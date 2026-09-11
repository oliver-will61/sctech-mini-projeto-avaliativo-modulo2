"use strict";
// Service responsável pela autenticação e cadastro de usuários
// Contém as validações de registro, login e o hash da senha antes de salvar no banco
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
    // Cadastra um novo usuário no sistema
    // Valida campos obrigatórios, formato do e-mail, duplicidade e armazena a senha com hash
    async register(data) {
        const { name, email, password, role } = data;
        // Verifica se todos os campos obrigatórios foram preenchidos
        if (!name || !email || !password) {
            throw new AppError_1.AppError("Name, email and password are required", 400);
        }
        // Valida o formato do e-mail usando expressão regular
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new AppError_1.AppError("Invalid email format", 400);
        }
        // Verifica se já existe um usuário com este e-mail
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new AppError_1.AppError("Email already in use", 400);
        }
        // Gera o hash da senha com bcrypt (custo 10 rounds)
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        // Cria o usuário no banco com a senha hasheada
        const user = await this.userRepository.create({
            name,
            email,
            password: hashedPassword,
            ...(role && { role }),
        });
        // Remove a senha do objeto antes de retornar (nunca expor a senha)
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
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
            throw new AppError_1.AppError("Invalid credentiaols", 401);
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