// DTO para atualização de paciente
// Todos os campos são opcionais (atualização parcial)

export interface UpdatePacienteDTO {
  nome?: string;
  cpf?: string;
  email?: string;
  dataNascimento?: string;
}
