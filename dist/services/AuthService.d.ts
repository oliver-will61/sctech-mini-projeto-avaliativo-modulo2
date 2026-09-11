export declare class AuthService {
    private userRepository;
    register(data: {
        name: string;
        email: string;
        password: string;
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