// Implementação concreta do repositório de médico
// Responsável por todas as operações de banco de dados da tabela "medicos"

import { AppDataSource } from "../database/data-source";
import { Medico } from "../entities/Medico";
import { IMedicoRepository } from "./IMedicoRepository";

export class MedicoRepository implements IMedicoRepository {
  // Obtém o repositório do TypeORM para a entidade Medico
  private repository = AppDataSource.getRepository(Medico);

  // Retorna todos os médicos em ordem alfabética, já com a especialidade
  async findAll(): Promise<Medico[]> {
    return this.repository.find({
      relations: { especialidade: true },
      order: { nome: "ASC" },
    });
  }

  // Busca um médico pelo ID, já com a especialidade
  async findById(id: number): Promise<Medico | null> {
    return this.repository.findOne({
      where: { id },
      relations: { especialidade: true },
    });
  }

  // Busca pelo CRM ignorando maiúsculas/minúsculas ("12345/SC" = "12345/sc")
  // Usado para garantir que o CRM seja único
  async findByCrm(crm: string): Promise<Medico | null> {
    return this.repository
      .createQueryBuilder("medico")
      .where("LOWER(medico.crm) = LOWER(:crm)", { crm })
      .getOne();
  }

  // Conta os médicos vinculados a uma especialidade
  // Usado pelo EspecialidadeService para impedir a remoção de especialidades em uso
  async countByEspecialidadeId(especialidadeId: number): Promise<number> {
    return this.repository.count({ where: { especialidadeId } });
  }

  // Cria um novo médico e retorna o registro completo (com a especialidade)
  async create(data: Partial<Medico>): Promise<Medico> {
    const medico = this.repository.create(data);
    const salvo = await this.repository.save(medico);
    return (await this.findById(salvo.id))!;
  }

  // Atualiza um médico e retorna os dados atualizados
  async update(id: number, data: Partial<Medico>): Promise<Medico | null> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  // Remove um médico pelo ID
  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
