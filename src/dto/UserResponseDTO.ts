// DTO para resposta de usuário
// Define a estrutura retornada nas APIs (sem senha)

export interface UserResponseDTO {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: Date;
}
