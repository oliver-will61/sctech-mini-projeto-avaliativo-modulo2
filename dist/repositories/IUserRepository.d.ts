import { User } from "../entities/User";
export interface IUserRepository {
    findAll(): Promise<User[]>;
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findByEmailWithPassword(email: string): Promise<(User & {
        password: string;
    }) | null>;
    create(data: Partial<User>): Promise<User>;
    update(id: string, data: Partial<User>): Promise<User | null>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=IUserRepository.d.ts.map