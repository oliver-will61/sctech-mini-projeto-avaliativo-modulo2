import "reflect-metadata";
export declare enum UserRole {
    ADMIN = "admin",
    USER = "user",
    MODERATOR = "moderator"
}
export declare class User {
    id: string;
    name: string;
    email: string;
    password: string;
    role: UserRole;
    created_at: Date;
}
//# sourceMappingURL=User.d.ts.map