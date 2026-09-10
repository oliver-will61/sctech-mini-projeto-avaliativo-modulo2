// Interface que define o contrato para repositórios de usuário
// Qualquer implementação de repositório de usuário deve seguir esta interface
// Isso permite trocar a implementação (PostgreSQL, MongoDB, memória) sem alterar o service

import { User } from "../entities/User";

export interface IUserRepository {
  // Retorna todos os usuários cadastrados
  findAll(): Promise<User[]>;

  // Busca um usuário pelo ID (retorna null se não encontrar)
  findById(id: string): Promise<User | null>;

  // Busca um usuário pelo e-mail (retorna null se não encontrar)
  findByEmail(email: string): Promise<User | null>;

  // Busca um usuário pelo e-mail incluindo a senha (necessário para autenticação)
  // A senha não é retornada nas queries padrão por causa do select: false na entidade
  findByEmailWithPassword(email: string): Promise<(User & { password: string }) | null>;

  // Cria um novo usuário no banco
  create(data: Partial<User>): Promise<User>;

  // Atualiza os dados de um usuário pelo ID
  update(id: string, data: Partial<User>): Promise<User | null>;

  // Remove um usuário do banco pelo ID
  delete(id: string): Promise<void>;
}
