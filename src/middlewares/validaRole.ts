// Middleware responsável pela autorização baseada em funções (RBAC)
// Verifica se o perfil do usuário autenticado possui permissão para acessar um recurso
// Lança AppError que é capturado pelo errorHandler middleware
// Deve ser executado após o validaToken, que coloca o perfil do usuário no req.user

import { Response, NextFunction } from "express";
import { AuthRequest } from "./validaToken";
import { AppError } from "../utils/AppError";

// Fábrica de middleware: recebe os perfis permitidos e retorna o middleware de autorização
export function validaRole(...allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    // Usuário não autenticado (não deve ocorrer após o validaToken)
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    // Perfil do usuário não possui permissão para esta rota
    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError("Forbidden", 403);
    }

    next();
  };
}
