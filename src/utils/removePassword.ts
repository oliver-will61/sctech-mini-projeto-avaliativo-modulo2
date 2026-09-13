// Utilitário para remover o campo password de objetos de usuário
// Usado para garantir que a senha nunca seja exposta nas respostas da API

import { User } from "../entities/User";
import { UserResponseDTO } from "../dto/UserResponseDTO";

export function removePassword(user: User & { password?: string }): UserResponseDTO {
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword as UserResponseDTO;
}
