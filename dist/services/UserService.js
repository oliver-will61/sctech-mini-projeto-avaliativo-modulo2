"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const UserRepository_1 = require("../repositories/UserRepository");
const AppError_1 = require("../utils/AppError");
class UserService {
    constructor() {
        this.userRepository = new UserRepository_1.UserRepository();
    }
    async findAll() {
        return this.userRepository.findAll();
    }
    async findById(id) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new AppError_1.AppError("User not found", 404);
        }
        return user;
    }
    async findByEmail(email) {
        return this.userRepository.findByEmail(email);
    }
    async create(data) {
        const existingUser = await this.userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new AppError_1.AppError("Email already in use", 400);
        }
        return this.userRepository.create(data);
    }
    async update(id, data) {
        await this.findById(id);
        const user = await this.userRepository.update(id, data);
        return user;
    }
    async delete(id) {
        await this.findById(id);
        await this.userRepository.delete(id);
    }
}
exports.UserService = UserService;
//# sourceMappingURL=UserService.js.map