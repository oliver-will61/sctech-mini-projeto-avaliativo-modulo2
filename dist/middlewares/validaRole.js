"use strict";
// Middleware responsável pela autorização baseada em funções (RBAC)
// Verifica se o perfil do usuário autenticado possui permissão para acessar um recurso
// Lança AppError que é capturado pelo errorHandler middleware
// Deve ser executado após o validaToken, que coloca o perfil do usuário no req.user
Object.defineProperty(exports, "__esModule", { value: true });
exports.validaRole = validaRole;
const AppError_1 = require("../utils/AppError");
// Fábrica de middleware: recebe os perfis permitidos e retorna o middleware de autorização
function validaRole(...allowedRoles) {
    return (req, res, next) => {
        // Usuário não autenticado (não deve ocorrer após o validaToken)
        if (!req.user) {
            throw new AppError_1.AppError("Unauthorized: usuário não atenticado", 401);
        }
        // Perfil do usuário não possui permissão para esta rota
        if (!allowedRoles.includes(req.user.role)) {
            throw new AppError_1.AppError("Forbidden: o perfil do usuário não possui permissão para essa ação", 403);
        }
        next();
    };
}
//# sourceMappingURL=validaRole.js.map