import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middleWares/auth";
declare const signUp: (req: Request, res: Response) => Promise<void>;
declare const signIn: (req: Request, res: Response) => Promise<void>;
declare const forgetPassword: (req: Request, res: Response) => Promise<void>;
declare const resetPasswordByToken: (req: Request, res: Response) => Promise<void>;
declare const authenticatedResetPassword: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export { signUp, signIn, forgetPassword, authenticatedResetPassword, resetPasswordByToken, };
