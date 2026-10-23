// Implementação concreta do repositório de paciente
// Responsável por todas as operações de banco de dados da tabela "pacientes"

import { AppDataSource } from "../database/data-source";
import { Paciente } from "../entities/Paciente";
import { IPacienteRepository } from "./IPacienteRepository";

export class PacienteRepository implements IPacienteRepository {
  // Obtém o repositório do TypeORM para a entidade Paciente
  private repository = AppDataSource.getRepository(Paciente);

  // Retorna todos os pacientes em ordem alfabética
  async findAll(): Promise<Paciente[]> {
    return this.repository.find({ order: { nome: "ASC" } });
  }

  // Busca um paciente pelo ID
  async findById(id: number): Promise<Paciente | null> {
    return this.repository.findOneBy({ id });
  }

  // Busca um paciente pelo CPF (o CPF é salvo apenas com números)
  // Usado para garantir que o CPF seja único
  async findByCpf(cpf: string): Promise<Paciente | null> {
    return this.repository.findOneBy({ cpf });
  }

  // Cria um novo paciente no banco
  async create(data: Partial<Paciente>): Promise<Paciente> {
    const paciente = this.repository.create(data);
    return this.repository.save(paciente);
  }

  // Atualiza um paciente e retorna os dados atualizados
  async update(id: number, data: Partial<Paciente>): Promise<Paciente | null> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  // Remove um paciente pelo ID
  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
