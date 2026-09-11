// Middleware responsável pela autorização baseada em funções (RBAC)
// Verifica se o perfil do usuário autenticado possui permissão para acessar um recurso
// Retorna 403 (proibido) quando o perfil do usuário não está entre os permitidos na rota
// Deve ser executado após o validaToken, que coloca o perfil do usuário no req.user

import { Response, NextFunction } from "express";
import { AuthRequest } from "./validaToken";

// Fábrica de middleware: recebe os perfis permitidos e retorna o middleware de autorização
export function authorizeRole(...allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): Response | void => {
    // Usuário não autenticado (não deve ocorrer após o validaToken)
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Perfil do usuário não possui permissão para esta rota
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    return next();
  };
}