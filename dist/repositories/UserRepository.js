"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const data_source_1 = require("../database/data-source");
const User_1 = require("../entities/User");
class UserRepository {
    constructor() {
        this.repository = data_source_1.AppDataSource.getRepository(User_1.User);
    }
    async findAll() {
        return this.repository.find();
    }
    async findById(id) {
        return this.repository.findOneBy({ id });
    }
    async findByEmail(email) {
        return this.repository.findOneBy({ email });
    }
    async create(data) {
        const user = this.repository.create(data);
        return this.repository.save(user);
    }
    async update(id, data) {
        await this.repository.update(id, data);
        return this.findById(id);
    }
    async delete(id) {
        await this.repository.delete(id);
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=UserRepository.js.map