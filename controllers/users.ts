import { Request, Response } from "express";
import * as usersService from "../services/users";
import { AuthenticatedRequest } from "../middleWares/auth";

const signUp = async (req: Request, res: Response): Promise<void> => {
  const { status, ...data } = await usersService.createUser(req.body);
  res.status(status).send(data);
};
//------------------------------------------------------------------------------
const signIn = async (req: Request, res: Response): Promise<void> => {
  const { status, ...data } = await usersService.signIn(req.body);
  res.status(status).send(data);
};
//------------------------------------------------------------------------------
const forgetPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  const { status, ...data } = await usersService.forgetPassword(email);
  res.status(status).send(data);
};
//------------------------------------------------------------------------------
const resetPasswordByToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { status, ...data } = await usersService.resetPassword(req.body);
  res.status(status).send(data);
};
//------------------------------------------------------------------------------
const authenticatedResetPassword = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const user = { userId: req.user.id, ...req.body };
  const { status, ...data } = await usersService.resetPassword(user);
  res.status(status).send(data);
};
//------------------------------------------------------------------------------
export {
  signUp,
  signIn,
  forgetPassword,
  authenticatedResetPassword,
  resetPasswordByToken,
};
