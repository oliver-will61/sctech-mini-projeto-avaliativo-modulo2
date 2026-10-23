// Controller responsável por receber as requisições HTTP de pacientes
// Extrai os dados da request, chama o service e retorna a response
// Não contém lógica de negócio — apenas orquestra service e resposta HTTP

import { Request, Response } from "express";
import { PacienteService } from "../services/PacienteService";
import { CreatePacienteDTO } from "../dto/CreatePacienteDTO";
import { UpdatePacienteDTO } from "../dto/UpdatePacienteDTO";

export class PacienteController {
  private pacienteService = new PacienteService();

  // GET /pacientes — lista todos os pacientes
  async index(req: Request, res: Response): Promise<Response> {
    const pacientes = await this.pacienteService.findAll();
    return res.json(pacientes);
  }

  // GET /pacientes/:id — retorna um paciente pelo ID
  async show(req: Request, res: Response): Promise<Response> {
    const paciente = await this.pacienteService.findById(Number(req.params.id));
    return res.json(paciente);
  }

  // POST /pacientes — cria um novo paciente
  async store(req: Request, res: Response): Promise<Response> {
    const { nome, cpf, email, dataNascimento } = req.body;
    const dto: CreatePacienteDTO = { nome, cpf, email, dataNascimento };
    const paciente = await this.pacienteService.create(dto);
    return res.status(201).json(paciente);
  }

  // PUT /pacientes/:id — atualiza um paciente
  // Apenas os campos do DTO são repassados (ignora id e outros campos do body)
  async update(req: Request, res: Response): Promise<Response> {
    const { nome, cpf, email, dataNascimento } = req.body;
    const dto: UpdatePacienteDTO = { nome, cpf, email, dataNascimento };
    const paciente = await this.pacienteService.update(Number(req.params.id), dto);
    return res.json(paciente);
  }

  // DELETE /pacientes/:id — remove um paciente
  async delete(req: Request, res: Response): Promise<Response> {
    await this.pacienteService.delete(Number(req.params.id));
    return res.status(204).send();
  }
}
