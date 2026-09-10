"use strict";
// Middleware global de tratamento de erros
// Captura erros lançados nas rotas e retorna uma resposta HTTP adequada
// Deve ser registrado após todas as rotas no Express
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const AppError_1 = require("../utils/AppError");
function errorHandler(err, req, res, next) {
    // Se for um AppError (erro conhecido), retorna o statusCode e mensagem definidos
    if (err instanceof AppError_1.AppError) {
        return res.status(err.statusCode).json({ error: err.message });
    }
    // Se for um erro inesperado, loga no console e retorna erro 500
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
}
//# sourceMappingURL=errorHandler.js.map