// Service responsável pela autenticação e cadastro de usuários
// Contém as validações de registro e o hash da senha antes de salvar no banco

import bcrypt from "bcrypt";
import { UserRepository } from "../repositories/UserRepository";
import { AppError } from "../utils/AppError";

export class AuthService {
  private userRepository = new UserRepository();

  // Cadastra um novo usuário no sistema
  // Valida campos obrigatórios, formato do e-mail, duplicidade e armazena a senha com hash
  async register(data: { name: string; email: string; password: string }) {
    const { name, email, password } = data;

    // Verifica se todos os campos obrigatórios foram preenchidos
    if (!name || !email || !password) {
      throw new AppError("Name, email and password are required", 400);
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
    });

    // Remove a senha do objeto antes de retornar (nunca expor a senha)
    const { password: _, ...userWithoutPassword } = user as any;
    return userWithoutPassword;
  }
}
