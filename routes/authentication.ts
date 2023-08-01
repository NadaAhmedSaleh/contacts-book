import * as express from "express";
import {
  resetPasswordByToken,
  forgetPassword,
  signUp,
  signIn,
  authenticatedResetPassword,
} from "../controllers/users";
import auth from "../middleWares/auth";

const router = express.Router();

router.post("/signUp", signUp);
//-----------------------------------------------------------------------------
router.post("/signIn", signIn);
//-----------------------------------------------------------------------------
/*router.post(
  "/resetPasswordById",
  auth,
  authenticatedResetPassword
);*/
//-----------------------------------------------------------------------------
router.post("/forgetPassword", forgetPassword);
//-----------------------------------------------------------------------------
router.post("/resetPasswordByToken", resetPasswordByToken);

export default router;
