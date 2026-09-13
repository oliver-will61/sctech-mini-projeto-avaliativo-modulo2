// DTO para atualização de usuário
// Todos os campos são opcionais (atualização parcial)

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
}
