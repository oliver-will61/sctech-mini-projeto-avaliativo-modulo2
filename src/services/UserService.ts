// Service responsável pela lógica de negócio do usuário
// Contém as regras de validação e orquestra as chamadas ao repositório
// Não acessa o banco diretamente — sempre passa pelo repositório

import bcrypt from "bcrypt";
import { User } from "../entities/User";
import { UserRepository } from "../repositories/UserRepository";
import { AppError } from "../utils/AppError";

export class UserService {
  private userRepository = new UserRepository();

  // Retorna todos os usuários cadastrados
  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  // Busca um usuário pelo ID, lança erro se não encontrar
  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new AppError("Usuário não encontrado", 404);
    }
    return user;
  }

  // Busca um usuário pelo e-mail
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  // Cria um novo usuário após verificar se o e-mail já está em uso
  // A senha é armazenada apenas com hash (bcrypt), nunca em texto puro
  async create(data: Partial<User>): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(data.email!);
    if (existingUser) {
      throw new AppError("E-mail já cadastrado", 400);
    }

    // Gera o hash da senha com bcrypt (custo 10 rounds)
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    const user = await this.userRepository.create(data);

    // Remove a senha do objeto antes de retornar (nunca expor a senha)
    const { password: _, ...userWithoutPassword } = user as any;
    return userWithoutPassword as User;
  }

  // Atualiza um usuário (verifica se existe antes de atualizar)
  // Se uma nova senha for enviada, ela é hasheada antes de ser salva
  async update(id: number, data: Partial<User>): Promise<User> {
    await this.findById(id);

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    const user = await this.userRepository.update(id, data);
    return user!;
  }

  // Remove um usuário (verifica se existe antes de remover)
  async delete(id: number): Promise<void> {
    await this.findById(id);
    await this.userRepository.delete(id);
  }
}
