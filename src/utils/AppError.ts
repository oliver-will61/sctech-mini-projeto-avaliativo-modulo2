// Classe utilitária para criação de erros personalizados
// Usada em services e middlewares para retornar erros HTTP com mensagem e código de status

export class AppError {
  // Mensagem descritiva do erro
  public readonly message: string;

  // Código HTTP (padrão 400 - Bad Request)
  public readonly statusCode: number;

  constructor(message: string, statusCode = 400) {
    this.message = message;
    this.statusCode = statusCode;
  }
}
