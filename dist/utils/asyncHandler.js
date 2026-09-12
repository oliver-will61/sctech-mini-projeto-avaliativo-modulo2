"use strict";
// Utilitário que wraps funções async de rotas para capturar erros
// Express não trata promises rejeitadas automaticamente, este wrapper
// converte erros para o errorHandler middleware
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = asyncHandler;
function asyncHandler(fn) {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
}
//# sourceMappingURL=asyncHandler.js.map