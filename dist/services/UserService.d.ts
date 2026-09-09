import { User } from "../entities/User";
export declare class UserService {
    private userRepository;
    findAll(): Promise<User[]>;
    findById(id: string): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    create(data: Partial<User>): Promise<User>;
    update(id: string, data: Partial<User>): Promise<User>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=UserService.d.ts.map