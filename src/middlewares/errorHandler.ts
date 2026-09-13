// Middleware global de tratamento de erros
// Captura erros lançados nas rotas e retorna uma resposta HTTP adequada
// Deve ser registrado após todas as rotas no Express

import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): Response {
  // Se for um AppError (erro conhecido), retorna o statusCode e mensagem definidos
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  // Se for um erro inesperado, loga no console e retorna erro 500
  console.error(err);
  return res.status(500).json({ error: "Erro interno do servidor" });
}
