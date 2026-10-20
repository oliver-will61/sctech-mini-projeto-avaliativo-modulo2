// Controller responsável por receber as requisições HTTP de especialidades
// Extrai os dados da request, chama o service e retorna a response
// Não contém lógica de negócio — apenas orquestra service e resposta HTTP

import { Request, Response } from "express";
import { EspecialidadeService } from "../services/EspecialidadeService";
import { CreateEspecialidadeDTO } from "../dto/CreateEspecialidadeDTO";
import { UpdateEspecialidadeDTO } from "../dto/UpdateEspecialidadeDTO";

export class EspecialidadeController {
  private especialidadeService = new EspecialidadeService();

  // GET /especialidades — lista todas as especialidades
  async index(req: Request, res: Response): Promise<Response> {
    const especialidades = await this.especialidadeService.findAll();
    return res.json(especialidades);
  }

  // GET /especialidades/:id — retorna uma especialidade pelo ID
  async show(req: Request, res: Response): Promise<Response> {
    const especialidade = await this.especialidadeService.findById(Number(req.params.id));
    return res.json(especialidade);
  }

  // POST /especialidades — cria uma nova especialidade
  async store(req: Request, res: Response): Promise<Response> {
    const { nome, descricao } = req.body;
    const dto: CreateEspecialidadeDTO = { nome, descricao };
    const especialidade = await this.especialidadeService.create(dto);
    return res.status(201).json(especialidade);
  }

  // PUT /especialidades/:id — atualiza uma especialidade
  // Apenas os campos do DTO são repassados (ignora id e outros campos do body)
  async update(req: Request, res: Response): Promise<Response> {
    const { nome, descricao } = req.body;
    const dto: UpdateEspecialidadeDTO = { nome, descricao };
    const especialidade = await this.especialidadeService.update(Number(req.params.id), dto);
    return res.json(especialidade);
  }

  // DELETE /especialidades/:id — remove uma especialidade
  async delete(req: Request, res: Response): Promise<Response> {
    await this.especialidadeService.delete(Number(req.params.id));
    return res.status(204).send();
  }
}
