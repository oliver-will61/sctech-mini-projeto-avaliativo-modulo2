import "reflect-metadata";
export declare enum UserRole {
    ADMIN = "admin",
    ATTENDANT = "atendente",
    USER = "user",
    MODERATOR = "moderator"
}
export declare class User {
    id: number;
    name: string;
    email: string;
    password: string;
    role: string;
    created_at: Date;
}
//# sourceMappingURL=User.d.ts.map