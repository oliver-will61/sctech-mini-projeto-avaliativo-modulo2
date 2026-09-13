// DTO para criação de usuário
// Define os dados obrigatórios e opcionais para o cadastro

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  role?: string;
}
