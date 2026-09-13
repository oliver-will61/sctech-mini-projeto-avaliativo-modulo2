// Controller responsável por receber as requisições HTTP de autenticação
// Extrai os dados da request, chama o AuthService e retorna a response

import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";
import { LoginDTO } from "../dto/LoginDTO";

export class AuthController {
  private authService = new AuthService();

  // POST /auth/login — valida credenciais e retorna token JWT
  async login(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;
    const dto: LoginDTO = { email, password };
    const result = await this.authService.login(dto);
    return res.json(result);
  }
}
