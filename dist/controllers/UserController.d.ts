import { Response } from "express";
import { AuthRequest } from "../middlewares/validaToken";
export declare class UserController {
    private userService;
    me(req: AuthRequest, res: Response): Promise<Response>;
    index(req: AuthRequest, res: Response): Promise<Response>;
    show(req: AuthRequest, res: Response): Promise<Response>;
    store(req: AuthRequest, res: Response): Promise<Response>;
    update(req: AuthRequest, res: Response): Promise<Response>;
    delete(req: AuthRequest, res: Response): Promise<Response>;
}
//# sourceMappingURL=UserController.d.ts.map