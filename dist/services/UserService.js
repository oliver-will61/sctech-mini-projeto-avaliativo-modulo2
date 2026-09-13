"use strict";
// Service responsável pela lógica de negócio do usuário
// Contém as regras de validação e orquestra as chamadas ao repositório
// Não acessa o banco diretamente — sempre passa pelo repositório
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const UserRepository_1 = require("../repositories/UserRepository");
const AppError_1 = require("../utils/AppError");
class UserService {
    constructor() {
        this.userRepository = new UserRepository_1.UserRepository();
    }
    // Retorna todos os usuários cadastrados
    async findAll() {
        return this.userRepository.findAll();
    }
    // Busca um usuário pelo ID, lança erro se não encontrar
    async findById(id) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new AppError_1.AppError("Usuário não encontrado", 404);
        }
        return user;
    }
    // Busca um usuário pelo e-mail
    async findByEmail(email) {
        return this.userRepository.findByEmail(email);
    }
    // Cria um novo usuário após verificar se o e-mail já está em uso
    // A senha é armazenada apenas com hash (bcrypt), nunca em texto puro
    async create(data) {
        const existingUser = await this.userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new AppError_1.AppError("E-mail já cadastrado", 400);
        }
        // Gera o hash da senha com bcrypt (custo 10 rounds)
        if (data.password) {
            data.password = await bcrypt_1.default.hash(data.password, 10);
        }
        const user = await this.userRepository.create(data);
        // Remove a senha do objeto antes de retornar (nunca expor a senha)
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    // Atualiza um usuário (verifica se existe antes de atualizar)
    // Se uma nova senha for enviada, ela é hasheada antes de ser salva
    async update(id, data) {
        await this.findById(id);
        if (data.password) {
            data.password = await bcrypt_1.default.hash(data.password, 10);
        }
        const user = await this.userRepository.update(id, data);
        return user;
    }
    // Remove um usuário (verifica se existe antes de remover)
    async delete(id) {
        await this.findById(id);
        await this.userRepository.delete(id);
    }
}
exports.UserService = UserService;
//# sourceMappingURL=UserService.js.map