import { Request, Response, NextFunction } from "express";
export interface AuthRequest extends Request {
    user?: {
        id: number;
        role: string;
    };
}
export declare function validaToken(req: AuthRequest, res: Response, next: NextFunction): Response | void;
//# sourceMappingURL=validaToken.d.ts.map