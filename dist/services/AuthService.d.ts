export declare class AuthService {
    private userRepository;
    private static readonly ALLOWED_SELF_REGISTER_ROLES;
    register(data: {
        name: string;
        email: string;
        password: string;
        role?: string;
    }): Promise<any>;
    login(data: {
        email: string;
        password: string;
    }): Promise<{
        user: any;
        token: string;
    }>;
}
//# sourceMappingURL=AuthService.d.ts.map