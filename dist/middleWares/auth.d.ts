import { Request, Response, NextFunction } from "express";
interface AuthenticatedRequest extends Request {
    user: {
        id: string;
    };
}
declare const auth: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export default auth;
export { AuthenticatedRequest };
