import { Response, NextFunction } from "express";
import { AuthRequest } from "./validaToken";
export declare function validaRole(...allowedRoles: string[]): (req: AuthRequest, res: Response, next: NextFunction) => void;
//# sourceMappingURL=validaRole.d.ts.map