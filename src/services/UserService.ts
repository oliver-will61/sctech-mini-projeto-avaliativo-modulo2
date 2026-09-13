// Service responsável pela lógica de negócio do usuário
// Contém as regras de validação e orquestra as chamadas ao repositório
// Não acessa o banco diretamente — sempre passa pelo repositório

import bcrypt from "bcrypt";
import { User } from "../entities/User";
import { UserRepository } from "../repositories/UserRepository";
import { AppError } from "../utils/AppError";
import { CreateUserDTO } from "../dto/CreateUserDTO";
import { UpdateUserDTO } from "../dto/UpdateUserDTO";
import { UserResponseDTO } from "../dto/UserResponseDTO";
import { removePassword } from "../utils/removePassword";

export class UserService {
  private userRepository = new UserRepository();

  // Retorna todos os usuários cadastrados
  async findAll(): Promise<UserResponseDTO[]> {
    const users = await this.userRepository.findAll();
    return users.map(removePassword);
  }

  // Busca um usuário pelo ID, lança erro se não encontrar
  async findById(id: number): Promise<UserResponseDTO> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new AppError("Usuário não encontrado", 404);
    }
    return removePassword(user);
  }

  // Busca um usuário pelo e-mail
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  // Cria um novo usuário após verificar se o e-mail já está em uso
  // A senha é armazenada apenas com hash (bcrypt), nunca em texto puro
  async create(data: CreateUserDTO): Promise<UserResponseDTO> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new AppError("E-mail já cadastrado", 409);
    }

    // Gera o hash da senha com bcrypt (custo 10 rounds)
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.userRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role,
    });

    // Remove a senha do objeto antes de retornar (nunca expor a senha)
    return removePassword(user);
  }

  // Atualiza um usuário (verifica se existe antes de atualizar)
  // Se uma nova senha for enviada, ela é hasheada antes de ser salva
  async update(id: number, data: UpdateUserDTO): Promise<UserResponseDTO> {
    await this.findById(id);

    const updateData: Partial<User> = { ...data };

    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    const user = await this.userRepository.update(id, updateData);
    return removePassword(user!);
  }

  // Remove um usuário (verifica se existe antes de remover)
  async delete(id: number): Promise<void> {
    await this.findById(id);
    await this.userRepository.delete(id);
  }
}
