// DTO para atualização de médico
// Todos os campos são opcionais (atualização parcial)

export interface UpdateMedicoDTO {
  nome?: string;
  crm?: string;
  email?: string;
  telefone?: string;
  especialidadeId?: number;
}
