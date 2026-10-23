// Interface que define o contrato para repositórios de paciente
// Qualquer implementação de repositório de paciente deve seguir esta interface

import { Paciente } from "../entities/Paciente";

export interface IPacienteRepository {
  // Retorna todos os pacientes cadastrados
  findAll(): Promise<Paciente[]>;

  // Busca um paciente pelo ID (retorna null se não encontrar)
  findById(id: number): Promise<Paciente | null>;

  // Busca um paciente pelo CPF (apenas números)
  findByCpf(cpf: string): Promise<Paciente | null>;

  // Cria um novo paciente no banco
  create(data: Partial<Paciente>): Promise<Paciente>;

  // Atualiza os dados de um paciente pelo ID
  update(id: number, data: Partial<Paciente>): Promise<Paciente | null>;

  // Remove um paciente do banco pelo ID
  delete(id: number): Promise<void>;
}
