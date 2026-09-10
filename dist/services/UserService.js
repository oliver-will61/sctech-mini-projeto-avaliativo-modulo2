"use strict";
// Service responsável pela lógica de negócio do usuário
// Contém as regras de validação e orquestra as chamadas ao repositório
// Não acessa o banco diretamente — sempre passa pelo repositório
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
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
            throw new AppError_1.AppError("User not found", 404);
        }
        return user;
    }
    // Busca um usuário pelo e-mail
    async findByEmail(email) {
        return this.userRepository.findByEmail(email);
    }
    // Cria um novo usuário após verificar se o e-mail já está em uso
    async create(data) {
        const existingUser = await this.userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new AppError_1.AppError("Email already in use", 400);
        }
        return this.userRepository.create(data);
    }
    // Atualiza um usuário (verifica se existe antes de atualizar)
    async update(id, data) {
        await this.findById(id);
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