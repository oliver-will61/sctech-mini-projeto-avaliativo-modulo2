// DTO para criação de especialidade
// O nome é obrigatório e a descrição é opcional

export interface CreateEspecialidadeDTO {
  nome: string;
  descricao?: string;
}
