// Interface que define o contrato para repositórios de médico
// Qualquer implementação de repositório de médico deve seguir esta interface

import { Medico } from "../entities/Medico";

export interface IMedicoRepository {
  // Retorna todos os médicos cadastrados (com a especialidade)
  findAll(): Promise<Medico[]>;

  // Busca um médico pelo ID (retorna null se não encontrar)
  findById(id: number): Promise<Medico | null>;

  // Busca um médico pelo CRM, sem diferenciar maiúsculas e minúsculas
  findByCrm(crm: string): Promise<Medico | null>;

  // Retorna quantos médicos estão vinculados a uma especialidade
  countByEspecialidadeId(especialidadeId: number): Promise<number>;

  // Cria um novo médico no banco
  create(data: Partial<Medico>): Promise<Medico>;

  // Atualiza os dados de um médico pelo ID
  update(id: number, data: Partial<Medico>): Promise<Medico | null>;

  // Remove um médico do banco pelo ID
  delete(id: number): Promise<void>;
}
