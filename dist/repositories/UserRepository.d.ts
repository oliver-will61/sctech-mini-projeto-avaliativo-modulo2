import { User } from "../entities/User";
import { IUserRepository } from "./IUserRepository";
export declare class UserRepository implements IUserRepository {
    private repository;
    findAll(): Promise<User[]>;
    findById(id: number): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findByEmailWithPassword(email: string): Promise<(User & {
        password: string;
    }) | null>;
    create(data: Partial<User>): Promise<User>;
    update(id: number, data: Partial<User>): Promise<User | null>;
    delete(id: number): Promise<void>;
}
//# sourceMappingURL=UserRepository.d.ts.map