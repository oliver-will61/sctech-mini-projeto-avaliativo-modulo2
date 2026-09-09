import { Request, Response } from "express";
import { UserService } from "../services/UserService";

export class UserController {
  private userService = new UserService();

  async index(req: Request, res: Response): Promise<Response> {
    const users = await this.userService.findAll();
    return res.json(users);
  }

  async show(req: Request, res: Response): Promise<Response> {
    const user = await this.userService.findById(req.params.id);
    return res.json(user);
  }

  async store(req: Request, res: Response): Promise<Response> {
    const { name, email, password, role } = req.body;
    const user = await this.userService.create({ name, email, password, role });
    return res.status(201).json(user);
  }

  async update(req: Request, res: Response): Promise<Response> {
    const user = await this.userService.update(req.params.id, req.body);
    return res.json(user);
  }

  async delete(req: Request, res: Response): Promise<Response> {
    await this.userService.delete(req.params.id);
    return res.status(204).send();
  }
}
