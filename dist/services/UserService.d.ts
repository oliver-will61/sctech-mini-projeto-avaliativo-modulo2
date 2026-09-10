import { User } from "../entities/User";
export declare class UserService {
    private userRepository;
    findAll(): Promise<User[]>;
    findById(id: number): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    create(data: Partial<User>): Promise<User>;
    update(id: number, data: Partial<User>): Promise<User>;
    delete(id: number): Promise<void>;
}
//# sourceMappingURL=UserService.d.ts.map