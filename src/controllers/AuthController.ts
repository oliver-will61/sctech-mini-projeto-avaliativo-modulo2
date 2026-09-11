// Controller responsável por receber as requisições HTTP de autenticação
// Extrai os dados da request, chama o AuthService e retorna a response

import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";

export class AuthController {
  private authService = new AuthService();

  // POST /auth/register — cadastra um novo usuário no sistema
  async register(req: Request, res: Response): Promise<Response> {
    const { name, email, password, role } = req.body;
    const user = await this.authService.register({ name, email, password, role });
    return res.status(201).json(user);
  }

  // POST /auth/login — valida credenciais e retorna token JWT
  async login(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;
    const result = await this.authService.login({ email, password });
    return res.json(result);
  }
}
