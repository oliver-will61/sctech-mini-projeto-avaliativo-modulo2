// DTO para criação de médico
// Todos os campos são obrigatórios; especialidadeId deve ser de uma especialidade existente

export interface CreateMedicoDTO {
  nome: string;
  crm: string;
  email: string;
  telefone: string;
  especialidadeId: number;
}
