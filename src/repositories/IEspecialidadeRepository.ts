// Interface que define o contrato para repositórios de especialidade
// Permite trocar a implementação sem alterar o service

import { Especialidade } from "../entities/Especialidade";

export interface IEspecialidadeRepository {
  // Retorna todas as especialidades cadastradas
  findAll(): Promise<Especialidade[]>;

  // Busca uma especialidade pelo ID (retorna null se não encontrar)
  findById(id: number): Promise<Especialidade | null>;

  // Busca uma especialidade pelo nome, sem diferenciar maiúsculas e minúsculas
  findByNome(nome: string): Promise<Especialidade | null>;

  // Cria uma nova especialidade no banco
  create(data: Partial<Especialidade>): Promise<Especialidade>;

  // Atualiza os dados de uma especialidade pelo ID
  update(id: number, data: Partial<Especialidade>): Promise<Especialidade | null>;

  // Remove uma especialidade do banco pelo ID
  delete(id: number): Promise<void>;
}
