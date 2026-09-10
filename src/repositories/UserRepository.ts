// Implementação concreta do repositório de usuário
// Responsável por todas as operações de banco de dados relacionadas à tabela "users"
// Usa o TypeORM para executar queries no PostgreSQL

import { AppDataSource } from "../database/data-source";
import { User } from "../entities/User";
import { IUserRepository } from "./IUserRepository";

export class UserRepository implements IUserRepository {
  // Obtém o repositório do TypeORM para a entidade User
  private repository = AppDataSource.getRepository(User);

  // Retorna todos os usuários do banco
  async findAll(): Promise<User[]> {
    return this.repository.find();
  }

  // Busca um usuário pelo ID
  async findById(id: string): Promise<User | null> {
    return this.repository.findOneBy({ id });
  }

  // Busca um usuário pelo e-mail (sem retornar a senha)
  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOneBy({ email });
  }

  // Busca um usuário pelo e-mail incluindo a senha (usado para autenticação)
  // Usa QueryBuilder para adicionar o select da coluna password (que está com select: false)
  async findByEmailWithPassword(email: string): Promise<(User & { password: string }) | null> {
    return this.repository
      .createQueryBuilder("user")
      .addSelect("user.password")
      .where("user.email = :email", { email })
      .getOne() as Promise<(User & { password: string }) | null>;
  }

  // Cria um novo usuário no banco
  async create(data: Partial<User>): Promise<User> {
    const user = this.repository.create(data);
    return this.repository.save(user);
  }

  // Atualiza um usuário e retorna os dados atualizados
  async update(id: string, data: Partial<User>): Promise<User | null> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  // Remove um usuário pelo ID
  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
