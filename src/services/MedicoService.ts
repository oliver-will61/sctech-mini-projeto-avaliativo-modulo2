// Service responsável pela lógica de negócio dos médicos
// Regras: todos os campos são obrigatórios, o CRM é único e
// todo médico deve estar vinculado a uma especialidade existente

import { Medico } from "../entities/Medico";
import { MedicoRepository } from "../repositories/MedicoRepository";
import { EspecialidadeRepository } from "../repositories/EspecialidadeRepository";
import { AppError } from "../utils/AppError";
import { CreateMedicoDTO } from "../dto/CreateMedicoDTO";
import { UpdateMedicoDTO } from "../dto/UpdateMedicoDTO";

// Campos de texto do médico, validados da mesma forma
type CampoTexto = "nome" | "crm" | "email" | "telefone";
const CAMPOS_TEXTO: CampoTexto[] = ["nome", "crm", "email", "telefone"];

export class MedicoService {
  private medicoRepository = new MedicoRepository();
  private especialidadeRepository = new EspecialidadeRepository();

  // Retorna todos os médicos cadastrados
  async findAll(): Promise<Medico[]> {
    return this.medicoRepository.findAll();
  }

  // Busca um médico pelo ID, lança erro se não encontrar
  async findById(id: number): Promise<Medico> {
    const medico = await this.medicoRepository.findById(id);
    if (!medico) {
      throw new AppError("Médico não encontrado", 404);
    }
    return medico;
  }

  // Cria um novo médico após validar os campos, o CRM e a especialidade
  async create(data: CreateMedicoDTO): Promise<Medico> {
    const nome = this.validarTexto(data.nome, "nome");
    const crm = this.validarTexto(data.crm, "crm");
    const email = this.validarTexto(data.email, "email");
    const telefone = this.validarTexto(data.telefone, "telefone");
    const especialidadeId = this.validarEspecialidadeId(data.especialidadeId);

    await this.garantirCrmDisponivel(crm);
    await this.garantirEspecialidadeExiste(especialidadeId);

    return this.medicoRepository.create({ nome, crm, email, telefone, especialidadeId });
  }

  // Atualiza um médico (atualização parcial)
  // Só valida os campos enviados; CRM e especialidade passam pelas mesmas regras do cadastro
  async update(id: number, data: UpdateMedicoDTO): Promise<Medico> {
    await this.findById(id);

    const nenhumCampo =
      CAMPOS_TEXTO.every((campo) => data[campo] === undefined) &&
      data.especialidadeId === undefined;
    if (nenhumCampo) {
      throw new AppError("Nenhum campo para atualizar", 400);
    }

    const updateData: Partial<Medico> = {};

    for (const campo of CAMPOS_TEXTO) {
      if (data[campo] !== undefined) {
        updateData[campo] = this.validarTexto(data[campo], campo);
      }
    }

    if (data.especialidadeId !== undefined) {
      updateData.especialidadeId = this.validarEspecialidadeId(data.especialidadeId);
    }

    if (updateData.crm !== undefined) {
      await this.garantirCrmDisponivel(updateData.crm, id);
    }

    if (updateData.especialidadeId !== undefined) {
      await this.garantirEspecialidadeExiste(updateData.especialidadeId);
    }

    const medico = await this.medicoRepository.update(id, updateData);
    return medico!;
  }

  // Remove um médico (verifica se existe antes de remover)
  async delete(id: number): Promise<void> {
    await this.findById(id);
    await this.medicoRepository.delete(id);
  }

  // Remove espaços das pontas e garante que o campo não está vazio
  private validarTexto(valor: string | undefined, campo: CampoTexto): string {
    const valorLimpo = typeof valor === "string" ? valor.trim() : "";
    if (!valorLimpo) {
      throw new AppError(`O campo ${campo} é obrigatório`, 400);
    }
    return valorLimpo;
  }

  // Converte o especialidadeId para número e garante que é um inteiro positivo
  private validarEspecialidadeId(valor: unknown): number {
    const especialidadeId = valor === null || valor === "" ? NaN : Number(valor);
    if (!Number.isInteger(especialidadeId) || especialidadeId <= 0) {
      throw new AppError("Informe uma especialidade válida (especialidadeId)", 400);
    }
    return especialidadeId;
  }

  // Lança erro 409 se o CRM já pertencer a outro médico
  // idAtual permite que um médico mantenha o próprio CRM na atualização
  private async garantirCrmDisponivel(crm: string, idAtual?: number): Promise<void> {
    const existente = await this.medicoRepository.findByCrm(crm);
    if (existente && existente.id !== idAtual) {
      throw new AppError("Já existe um médico com esse CRM", 409);
    }
  }

  // Lança erro 400 se a especialidade informada não existir
  private async garantirEspecialidadeExiste(especialidadeId: number): Promise<void> {
    const especialidade = await this.especialidadeRepository.findById(especialidadeId);
    if (!especialidade) {
      throw new AppError("A especialidade informada não existe", 400);
    }
  }
}
