"use strict";
// Implementação concreta do repositório de usuário
// Responsável por todas as operações de banco de dados relacionadas à tabela "users"
// Usa o TypeORM para executar queries no PostgreSQL
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const data_source_1 = require("../database/data-source");
const User_1 = require("../entities/User");
class UserRepository {
    constructor() {
        // Obtém o repositório do TypeORM para a entidade User
        this.repository = data_source_1.AppDataSource.getRepository(User_1.User);
    }
    // Retorna todos os usuários do banco
    async findAll() {
        return this.repository.find();
    }
    // Busca um usuário pelo ID
    async findById(id) {
        return this.repository.findOneBy({ id });
    }
    // Busca um usuário pelo e-mail (sem retornar a senha)
    async findByEmail(email) {
        return this.repository.findOneBy({ email });
    }
    // Busca um usuário pelo e-mail incluindo a senha (usado para autenticação)
    // Usa QueryBuilder para adicionar o select da coluna password (que está com select: false)
    async findByEmailWithPassword(email) {
        return this.repository
            .createQueryBuilder("user")
            .addSelect("user.password")
            .where("user.email = :email", { email })
            .getOne();
    }
    // Cria um novo usuário no banco
    async create(data) {
        const user = this.repository.create(data);
        return this.repository.save(user);
    }
    // Atualiza um usuário e retorna os dados atualizados
    async update(id, data) {
        await this.repository.update(id, data);
        return this.findById(id);
    }
    // Remove um usuário pelo ID
    async delete(id) {
        await this.repository.delete(id);
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=UserRepository.js.map