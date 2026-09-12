// Service responsável pela autenticação de usuários
// Contém a validação de login e geração de token JWT

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/UserRepository";
import { AppError } from "../utils/AppError";

export class AuthService {
  private userRepository = new UserRepository();

  // Valida as credenciais do usuário e retorna um token JWT
  // Em caso de credenciais inválidas, retorna erro 401 genérico
  async login(data: { email: string; password: string }) {
    const { email, password } = data;

    // Verifica se os campos foram preenchidos
    if (!email || !password) {
      throw new AppError("Email and password are required", 400);
    }

    // Busca o usuário pelo e-mail incluindo a senha (select: false na entidade)
    const user = await this.userRepository.findByEmailWithPassword(email);

    // Se não encontrar ou a senha não bater, retorna erro genérico (não informa qual campo)
    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new AppError("Invalid credentials", 401);
    }

    // Gera o token JWT com id e role do usuário  
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRATION || "1d" } as jwt.SignOptions
    );

    // Remove a senha do retorno
    const { password: _, ...userWithoutPassword } = user as any;
    return { user: userWithoutPassword, token };
  }
}
