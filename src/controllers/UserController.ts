// Controller responsável por receber as requisições HTTP do usuário
// Extrai os dados da request, chama o service e retorna a response
// Não contém lógica de negócio — apenas orquestra service e resposta HTTP

import { Request, Response } from "express";
import { UserService } from "../services/UserService";

export class UserController {
  private userService = new UserService();

  // GET /users — lista todos os usuários
  async index(req: Request, res: Response): Promise<Response> {
    const users = await this.userService.findAll();
    return res.json(users);
  }

  // GET /users/:id — retorna um usuário pelo ID
  async show(req: Request, res: Response): Promise<Response> {
    const user = await this.userService.findById(Number(req.params.id));
    return res.json(user);
  }

  // POST /users — cria um novo usuário
  async store(req: Request, res: Response): Promise<Response> {
    const { name, email, password, role } = req.body;
    const user = await this.userService.create({ name, email, password, role });
    return res.status(201).json(user);
  }

  // PUT /users/:id — atualiza um usuário
  async update(req: Request, res: Response): Promise<Response> {
    const user = await this.userService.update(Number(req.params.id), req.body);
    return res.json(user);
  }

  // DELETE /users/:id — remove um usuário
  async delete(req: Request, res: Response): Promise<Response> {
    await this.userService.delete(Number(req.params.id));
    return res.status(204).send();
  }
}
