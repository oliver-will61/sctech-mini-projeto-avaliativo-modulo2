// Service responsável pela lógica de negócio dos pacientes
// Regras: todos os campos são obrigatórios, o CPF é único e
// CPF, e-mail e data de nascimento precisam estar em formato válido

import { Paciente } from "../entities/Paciente";
import { PacienteRepository } from "../repositories/PacienteRepository";
import { AppError } from "../utils/AppError";
import {
  normalizarCpf,
  cpfValido,
  emailValido,
  dataValida,
  dataNoFuturo,
} from "../utils/validators";
import { CreatePacienteDTO } from "../dto/CreatePacienteDTO";
import { UpdatePacienteDTO } from "../dto/UpdatePacienteDTO";

// Campos do paciente informados pelo cliente
type CampoPaciente = "nome" | "cpf" | "email" | "dataNascimento";
const CAMPOS: CampoPaciente[] = ["nome", "cpf", "email", "dataNascimento"];

export class PacienteService {
  private pacienteRepository = new PacienteRepository();

  // Retorna todos os pacientes cadastrados
  async findAll(): Promise<Paciente[]> {
    return this.pacienteRepository.findAll();
  }

  // Busca um paciente pelo ID, lança erro se não encontrar
  async findById(id: number): Promise<Paciente> {
    const paciente = await this.pacienteRepository.findById(id);
    if (!paciente) {
      throw new AppError("Paciente não encontrado", 404);
    }
    return paciente;
  }

  // Cria um novo paciente após validar todos os campos e a unicidade do CPF
  async create(data: CreatePacienteDTO): Promise<Paciente> {
    const paciente = {
      nome: this.validarCampo("nome", data.nome),
      cpf: this.validarCampo("cpf", data.cpf),
      email: this.validarCampo("email", data.email),
      dataNascimento: this.validarCampo("dataNascimento", data.dataNascimento),
    };

    await this.garantirCpfDisponivel(paciente.cpf);

    return this.pacienteRepository.create(paciente);
  }

  // Atualiza um paciente (atualização parcial)
  // Só valida os campos enviados; o CPF passa pela mesma regra de unicidade do cadastro
  async update(id: number, data: UpdatePacienteDTO): Promise<Paciente> {
    await this.findById(id);

    if (CAMPOS.every((campo) => data[campo] === undefined)) {
      throw new AppError("Nenhum campo para atualizar", 400);
    }

    const updateData: Partial<Paciente> = {};

    for (const campo of CAMPOS) {
      if (data[campo] !== undefined) {
        updateData[campo] = this.validarCampo(campo, data[campo]);
      }
    }

    if (updateData.cpf !== undefined) {
      await this.garantirCpfDisponivel(updateData.cpf, id);
    }

    const paciente = await this.pacienteRepository.update(id, updateData);
    return paciente!;
  }

  // Remove um paciente (verifica se existe antes de remover)
  async delete(id: number): Promise<void> {
    await this.findById(id);
    await this.pacienteRepository.delete(id);
  }

  // Valida um campo e retorna o valor pronto para salvar:
  // - remove espaços das pontas e garante que não está vazio
  // - cpf: valida formato e dígitos verificadores, e salva apenas os números
  // - email: valida o formato e salva em minúsculas
  // - dataNascimento: valida o formato AAAA-MM-DD e impede datas no futuro
  private validarCampo(campo: CampoPaciente, valor: string | undefined): string {
    const valorLimpo = typeof valor === "string" ? valor.trim() : "";
    if (!valorLimpo) {
      throw new AppError(`O campo ${campo} é obrigatório`, 400);
    }

    switch (campo) {
      case "cpf":
        if (!cpfValido(valorLimpo)) {
          throw new AppError("CPF inválido", 400);
        }
        return normalizarCpf(valorLimpo);

      case "email":
        if (!emailValido(valorLimpo)) {
          throw new AppError("E-mail inválido", 400);
        }
        return valorLimpo.toLowerCase();

      case "dataNascimento":
        if (!dataValida(valorLimpo)) {
          throw new AppError("Data de nascimento inválida (use o formato AAAA-MM-DD)", 400);
        }
        if (dataNoFuturo(valorLimpo)) {
          throw new AppError("A data de nascimento não pode ser no futuro", 400);
        }
        return valorLimpo;

      default:
        return valorLimpo;
    }
  }

  // Lança erro 409 se o CPF já pertencer a outro paciente
  // idAtual permite que um paciente mantenha o próprio CPF na atualização
  private async garantirCpfDisponivel(cpf: string, idAtual?: number): Promise<void> {
    const existente = await this.pacienteRepository.findByCpf(cpf);
    if (existente && existente.id !== idAtual) {
      throw new AppError("Já existe um paciente com esse CPF", 409);
    }
  }
}
