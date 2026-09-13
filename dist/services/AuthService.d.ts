import { LoginDTO } from "../dto/LoginDTO";
import { UserResponseDTO } from "../dto/UserResponseDTO";
export declare class AuthService {
    private userRepository;
    login(data: LoginDTO): Promise<{
        user: UserResponseDTO;
        token: string;
    }>;
}
//# sourceMappingURL=AuthService.d.ts.map