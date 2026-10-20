// Service responsável pela lógica de negócio das especialidades
// Regras: o nome é obrigatório e único, e não é permitido remover
// uma especialidade que possua médicos vinculados

import { Especialidade } from "../entities/Especialidade";
import { EspecialidadeRepository } from "../repositories/EspecialidadeRepository";
import { MedicoRepository } from "../repositories/MedicoRepository";
import { AppError } from "../utils/AppError";
import { CreateEspecialidadeDTO } from "../dto/CreateEspecialidadeDTO";
import { UpdateEspecialidadeDTO } from "../dto/UpdateEspecialidadeDTO";

export class EspecialidadeService {
  private especialidadeRepository = new EspecialidadeRepository();
  private medicoRepository = new MedicoRepository();

  // Retorna todas as especialidades cadastradas
  async findAll(): Promise<Especialidade[]> {
    return this.especialidadeRepository.findAll();
  }

  // Busca uma especialidade pelo ID, lança erro se não encontrar
  async findById(id: number): Promise<Especialidade> {
    const especialidade = await this.especialidadeRepository.findById(id);
    if (!especialidade) {
      throw new AppError("Especialidade não encontrada", 404);
    }
    return especialidade;
  }

  // Cria uma nova especialidade após validar o nome
  async create(data: CreateEspecialidadeDTO): Promise<Especialidade> {
    const nome = this.validarNome(data.nome);
    await this.garantirNomeDisponivel(nome);

    return this.especialidadeRepository.create({
      nome,
      descricao: data.descricao,
    });
  }

  // Atualiza uma especialidade (atualização parcial)
  // Se o nome for alterado, verifica se não pertence a outra especialidade
  async update(id: number, data: UpdateEspecialidadeDTO): Promise<Especialidade> {
    await this.findById(id);

    if (data.nome === undefined && data.descricao === undefined) {
      throw new AppError("Nenhum campo para atualizar", 400);
    }

    const updateData: Partial<Especialidade> = {};

    if (data.nome !== undefined) {
      updateData.nome = this.validarNome(data.nome);
      await this.garantirNomeDisponivel(updateData.nome, id);
    }

    if (data.descricao !== undefined) {
      updateData.descricao = data.descricao;
    }

    const especialidade = await this.especialidadeRepository.update(id, updateData);
    return especialidade!;
  }

  // Remove uma especialidade, desde que não possua médicos vinculados
  async delete(id: number): Promise<void> {
    await this.findById(id);

    const totalMedicos = await this.medicoRepository.countByEspecialidadeId(id);
    if (totalMedicos > 0) {
      throw new AppError("Não é possível remover uma especialidade com médicos vinculados", 409);
    }

    await this.especialidadeRepository.delete(id);
  }

  // Remove espaços das pontas do nome e garante que ele não está vazio
  private validarNome(nome: string | undefined): string {
    const nomeLimpo = nome?.trim();
    if (!nomeLimpo) {
      throw new AppError("O nome da especialidade é obrigatório", 400);
    }
    return nomeLimpo;
  }

  // Lança erro 409 se o nome já pertencer a outra especialidade
  // idAtual permite que uma especialidade mantenha o próprio nome na atualização
  private async garantirNomeDisponivel(nome: string, idAtual?: number): Promise<void> {
    const existente = await this.especialidadeRepository.findByNome(nome);
    if (existente && existente.id !== idAtual) {
      throw new AppError("Já existe uma especialidade com esse nome", 409);
    }
  }
}
