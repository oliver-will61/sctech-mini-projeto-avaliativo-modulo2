"use strict";
// Utilitário para remover o campo password de objetos de usuário
// Usado para garantir que a senha nunca seja exposta nas respostas da API
Object.defineProperty(exports, "__esModule", { value: true });
exports.removePassword = removePassword;
function removePassword(user) {
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
}
//# sourceMappingURL=removePassword.js.map