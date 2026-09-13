import { User } from "../entities/User";
import { CreateUserDTO } from "../dto/CreateUserDTO";
import { UpdateUserDTO } from "../dto/UpdateUserDTO";
import { UserResponseDTO } from "../dto/UserResponseDTO";
export declare class UserService {
    private userRepository;
    findAll(): Promise<UserResponseDTO[]>;
    findById(id: number): Promise<UserResponseDTO>;
    findByEmail(email: string): Promise<User | null>;
    create(data: CreateUserDTO): Promise<UserResponseDTO>;
    update(id: number, data: UpdateUserDTO): Promise<UserResponseDTO>;
    delete(id: number): Promise<void>;
}
//# sourceMappingURL=UserService.d.ts.map