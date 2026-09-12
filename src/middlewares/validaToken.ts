// Middleware responsável por validar o token JWT enviado nas requisições
// Impede o acesso a rotas protegidas quando o token estiver ausente, inválido ou expirado
// Lança AppError que é capturado pelo errorHandler middleware

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError";

// Estende a interface Request do Express para incluir o payload do token
export interface AuthRequest extends Request {
  user?: {
    id: number;
    role: string;
  };
}

export function validaToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  // Obtém o header Authorization da requisição
  const authHeader = req.headers.authorization;

  // Verifica se o header existe e se começa com "Bearer "
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Token não fornecido", 401);
  }

  // Extrai o token (remove "Bearer " do início)
  const token = authHeader.split(" ")[1];

  try {
    // Valida o token usando o JWT_SECRET e decodifica o payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
      role: string;
    };

    // Adiciona os dados do usuário decodificados ao objeto request
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    // Continua para a próxima função/middleware
    next();
  } catch (error) {
    // Token inválido ou expirado
    throw new AppError("Token invalido ou expirado", 401);
  }
}
