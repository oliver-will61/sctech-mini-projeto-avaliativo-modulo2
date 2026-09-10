"use strict";
// Classe utilitária para criação de erros personalizados
// Usada em services e middlewares para retornar erros HTTP com mensagem e código de status
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
class AppError {
    constructor(message, statusCode = 400) {
        this.message = message;
        this.statusCode = statusCode;
    }
}
exports.AppError = AppError;
//# sourceMappingURL=AppError.js.map