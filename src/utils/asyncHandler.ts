// Utilitário que wraps funções async de rotas para capturar erros
// Express não trata promises rejeitadas automaticamente, este wrapper
// converte erros para o errorHandler middleware

import { Request, Response, NextFunction } from "express";

export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}
