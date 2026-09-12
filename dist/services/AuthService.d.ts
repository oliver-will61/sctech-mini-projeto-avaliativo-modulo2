export declare class AuthService {
    private userRepository;
    login(data: {
        email: string;
        password: string;
    }): Promise<{
        user: any;
        token: string;
    }>;
}
//# sourceMappingURL=AuthService.d.ts.map