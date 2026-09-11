// Service responsável pela autenticação e cadastro de usuários
// Contém as validações de registro, login e o hash da senha antes de salvar no banco

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/UserRepository";
import { AppError } from "../utils/AppError";
import { UserRole } from "../entities/User";

export class AuthService {
  private userRepository = new UserRepository();

  // Perfis que podem ser autoatribuídos no cadastro público
  // Admin e Moderator só podem ser atribuídos por um Admin já autenticado (via POST /users)
  private static readonly ALLOWED_SELF_REGISTER_ROLES = [
    UserRole.USER,
    UserRole.ATTENDANT,
  ];

  // Cadastra um novo usuário no sistema
  // Valida campos obrigatórios, formato do e-mail, duplicidade e armazena a senha com hash
  async register(data: { name: string; email: string; password: string; role?: string }) {
    const { name, email, password, role } = data;

    // Verifica se todos os campos obrigatórios foram preenchidos
    if (!name || !email || !password) {
      throw new AppError("Name, email and password are required", 400);
    }

    // Impede que um usuário se cadastre sozinho com perfis privilegiados (ex.: admin)
    if (role && !AuthService.ALLOWED_SELF_REGISTER_ROLES.includes(role as UserRole)) {
      throw new AppError("Cannot register with this role", 403);
    }

    // Valida o formato do e-mail usando expressão regular
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new AppError("Invalid email format", 400);
    }

    // Verifica se já existe um usuário com este e-mail
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new AppError("Email already in use", 400);
    }

    // Gera o hash da senha com bcrypt (custo 10 rounds)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria o usuário no banco com a senha hasheada
    const user = await this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      ...(role && { role }),
    });

    // Remove a senha do objeto antes de retornar (nunca expor a senha)
    const { password: _, ...userWithoutPassword } = user as any;
    return userWithoutPassword;
  }

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
      throw new AppError("Invalid credentiaols", 401);
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
