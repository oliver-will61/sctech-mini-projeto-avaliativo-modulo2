// Controller responsável por receber as requisições HTTP do usuário
// Extrai os dados da request, chama o service e retorna a response
// Não contém lógica de negócio — apenas orquestra service e resposta HTTP

import { Response } from "express";
import { UserService } from "../services/UserService";
import { AuthRequest } from "../middlewares/validaToken";
import { CreateUserDTO } from "../dto/CreateUserDTO";
import { UpdateUserDTO } from "../dto/UpdateUserDTO";

export class UserController {
  private userService = new UserService();

  // GET /users/me — retorna os dados do usuário autenticado a partir do token
  async me(req: AuthRequest, res: Response): Promise<Response> {
    const user = await this.userService.findById(req.user!.id);
    return res.json(user);
  }

  // GET /users — lista todos os usuários
  async index(req: AuthRequest, res: Response): Promise<Response> {
    const users = await this.userService.findAll();
    return res.json(users);
  }

  // GET /users/:id — retorna um usuário pelo ID
  async show(req: AuthRequest, res: Response): Promise<Response> {
    const user = await this.userService.findById(Number(req.params.id));
    return res.json(user);
  }

  // POST /users — cria um novo usuário
  async store(req: AuthRequest, res: Response): Promise<Response> {
    const { name, email, password, role } = req.body;
    const dto: CreateUserDTO = { name, email, password, role };
    const user = await this.userService.create(dto);
    return res.status(201).json(user);
  }

  // PUT /users/:id — atualiza um usuário
  async update(req: AuthRequest, res: Response): Promise<Response> {
    const dto: UpdateUserDTO = req.body;
    const user = await this.userService.update(Number(req.params.id), dto);
    return res.json(user);
  }

  // DELETE /users/:id — remove um usuário
  async delete(req: AuthRequest, res: Response): Promise<Response> {
    await this.userService.delete(Number(req.params.id));
    return res.status(204).send();
  }
}
