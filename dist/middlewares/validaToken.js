"use strict";
// Middleware responsável por validar o token JWT enviado nas requisições
// Impede o acesso a rotas protegidas quando o token estiver ausente, inválido ou expirado
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validaToken = validaToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function validaToken(req, res, next) {
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
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Adiciona os dados do usuário decodificados ao objeto request
        req.user = {
            id: decoded.id,
            role: decoded.role,
        };
        // Continua para a próxima função/middleware
        return next();
    }
    catch (error) {
        // Token inválido ou expirado
        return res.status(401).json({ error: "Invalid or expired token" });
    }
}
//# sourceMappingURL=validaToken.js.map