// Implementação concreta do repositório de especialidade
// Responsável por todas as operações de banco de dados da tabela "especialidades"

import { AppDataSource } from "../database/data-source";
import { Especialidade } from "../entities/Especialidade";
import { IEspecialidadeRepository } from "./IEspecialidadeRepository";

export class EspecialidadeRepository implements IEspecialidadeRepository {
  // Obtém o repositório do TypeORM para a entidade Especialidade
  private repository = AppDataSource.getRepository(Especialidade);

  // Retorna todas as especialidades em ordem alfabética
  async findAll(): Promise<Especialidade[]> {
    return this.repository.find({ order: { nome: "ASC" } });
  }

  // Busca uma especialidade pelo ID
  async findById(id: number): Promise<Especialidade | null> {
    return this.repository.findOneBy({ id });
  }

  // Busca pelo nome ignorando maiúsculas/minúsculas ("Cardiologia" = "cardiologia")
  // Usado para garantir que o nome seja único
  async findByNome(nome: string): Promise<Especialidade | null> {
    return this.repository
      .createQueryBuilder("especialidade")
      .where("LOWER(especialidade.nome) = LOWER(:nome)", { nome })
      .getOne();
  }

  // Cria uma nova especialidade no banco
  async create(data: Partial<Especialidade>): Promise<Especialidade> {
    const especialidade = this.repository.create(data);
    return this.repository.save(especialidade);
  }

  // Atualiza uma especialidade e retorna os dados atualizados
  async update(id: number, data: Partial<Especialidade>): Promise<Especialidade | null> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  // Remove uma especialidade pelo ID
  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
