// Middleware responsável por validar o token JWT enviado nas requisições
// Impede o acesso a rotas protegidas quando o token estiver ausente, inválido ou expirado

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

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
): Response | void {
  // Obtém o header Authorization da requisição
  const authHeader = req.headers.authorization;

  // Verifica se o header existe e se começa com "Bearer "
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token not provided" });
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
    return next();
  } catch (error) {
    // Token inválido ou expirado
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
