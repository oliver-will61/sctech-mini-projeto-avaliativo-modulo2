// Controller responsável por receber as requisições HTTP de médicos
// Extrai os dados da request, chama o service e retorna a response
// Não contém lógica de negócio — apenas orquestra service e resposta HTTP

import { Request, Response } from "express";
import { MedicoService } from "../services/MedicoService";
import { CreateMedicoDTO } from "../dto/CreateMedicoDTO";
import { UpdateMedicoDTO } from "../dto/UpdateMedicoDTO";

export class MedicoController {
  private medicoService = new MedicoService();

  // GET /medicos — lista todos os médicos
  async index(req: Request, res: Response): Promise<Response> {
    const medicos = await this.medicoService.findAll();
    return res.json(medicos);
  }

  // GET /medicos/:id — retorna um médico pelo ID
  async show(req: Request, res: Response): Promise<Response> {
    const medico = await this.medicoService.findById(Number(req.params.id));
    return res.json(medico);
  }

  // POST /medicos — cria um novo médico
  async store(req: Request, res: Response): Promise<Response> {
    const { nome, crm, email, telefone, especialidadeId } = req.body;
    const dto: CreateMedicoDTO = { nome, crm, email, telefone, especialidadeId };
    const medico = await this.medicoService.create(dto);
    return res.status(201).json(medico);
  }

  // PUT /medicos/:id — atualiza um médico
  // Apenas os campos do DTO são repassados (ignora id e outros campos do body)
  async update(req: Request, res: Response): Promise<Response> {
    const { nome, crm, email, telefone, especialidadeId } = req.body;
    const dto: UpdateMedicoDTO = { nome, crm, email, telefone, especialidadeId };
    const medico = await this.medicoService.update(Number(req.params.id), dto);
    return res.json(medico);
  }

  // DELETE /medicos/:id — remove um médico
  async delete(req: Request, res: Response): Promise<Response> {
    await this.medicoService.delete(Number(req.params.id));
    return res.status(204).send();
  }
}
