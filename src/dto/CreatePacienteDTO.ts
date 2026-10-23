// DTO para criação de paciente
// Todos os campos são obrigatórios
// cpf: com ou sem máscara | dataNascimento: formato AAAA-MM-DD

export interface CreatePacienteDTO {
  nome: string;
  cpf: string;
  email: string;
  dataNascimento: string;
}
