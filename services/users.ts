import config from "config";
import bcrypt from "bcryptjs";
import createError from "http-errors";
import jwt, { Secret } from "jsonwebtoken";
import { uid } from "rand-token";
import { isHttpError } from "http-errors";

import messages from "../utils/message.js";

import User, { IUser } from "../models/user.js";

// supporting functions
//------------------------------------------------------------------------------
/**
 * - a helper function validates that:
 *   - both password and confirm password entered and have same value
 *   - password entered follows the password regex
 * @param {string} password
 * @param {string} confirmPassword
 * @returns - hashed value of entered password
 */
const validateAndHashPassword = async (
  password: string,
  confirmPassword: string
): Promise<{ status: number; message?: string; hashedPassword?: string }> => {
  // check that both password and confirmPasswords strings are not empty
  if (!password) {
    return {
      status: 404,
      message: messages.general.missingFieldErr("Password"),
    };
  }
  if (!confirmPassword) {
    return {
      status: 404,
      message: messages.general.missingFieldErr("Confirmation password"),
    };
  }
  // check that both password and confirmation password have the same value
  if (password !== confirmPassword) {
    return {
      status: 400,
      message: messages.users.notMatchingPasswordsErr,
    };
  }
  // check that entered password matches the password criteria
  if (!new RegExp(config.get("regex.password")).test(password)) {
    return {
      status: 400,
      message: messages.general.invalidFieldErr(
        password,
        "Password",
        messages.general.fieldsRegex.password
      ),
    };
  }
  // if the entered password passed all the above checks return the hashed password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return {
    status: 200,
    hashedPassword,
  };
};
//------------------------------------------------------------------------------
// controllers functions
//------------------------------------------------------------------------------
const createUser = async (userObject: {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
}): Promise<{ status: number; message: string }> => {
  const { fullName, email, password, confirmPassword, phoneNumber } =
    userObject;
  // check fullName all required fields are entered
  if (!fullName || !email || !password || !confirmPassword || !phoneNumber) {
    return { status: 400, message: messages.general.missingInputErr };
  }
  // validate on the password and generate the hashed value
  const { status, message, hashedPassword } = await validateAndHashPassword(
    password,
    confirmPassword
  );
  if (status !== 200) {
    return { status, message: message || "" };
  }

  // create the user and if any exception error caught in the model validation return status 400 and the err message
  const user = new User({
    fullName,
    email,
    password: hashedPassword,
    phoneNumber,
    tokenValidation: uid(config.get("user.tokenValidationLength")),
  });
  try {
    await user.save();
    return {
      status: 200,
      message: messages.users.userCreatedSuccess(fullName),
    };
  } catch (err) {
    let errMessage = "";
    if (isHttpError(err)) {
      errMessage = err.message;

      if (err.code === 11000) {
        // this err code is returned when try to save doc with duplicate field of one of the fields with unique property
        var field = Object.keys(err.keyValue)[0]; // which field caused the error (username, email or phone number)
        var value = err.keyValue[field];
        errMessage = messages.general.alreadyExistsFieldErr(value, field);
      }
    }
    return {
      status: 400,
      message: errMessage,
    };
  }
};
//------------------------------------------------------------------------------
const signIn = async (userObject: {
  phoneNumber?: string;
  email?: string;
  password: string;
}): Promise<{ status: number; message?: string; accessToken?: string }> => {
  const { phoneNumber, email, password } = userObject; // user should enter either phone Number or email
  const userQuery = phoneNumber ? { phoneNumber } : { email };
  const user = await User.findOne(userQuery);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return {
      status: 400,
      message: messages.users.invalidCredentialsErr,
    };
  }
  //  generate the jwt token
  const accessToken = jwt.sign(
    {
      user: {
        email: user.email,
        id: user._id,
      },
      tokenValidation: user.tokenValidation,
    },
    config.get("secrets.jwtPrivateKey") as Secret,
    { expiresIn: config.get("timers.tokenLifeSpan") }
  );
  return { status: 200, accessToken };
};
//------------------------------------------------------------------------------
const forgetPassword = async (
  email: string
): Promise<{ status: number; message?: string; newToken?: string }> => {
  if (!email) {
    return {
      status: 400,
      message: messages.general.missingInputErr,
    };
  }
  // validate that entered email is in the correct email format
  if (!new RegExp(config.get("regex.email")).test(email)) {
    return {
      status: 400,
      message: messages.general.invalidFieldErr(email, "Email"),
    };
  }
  const user = await User.findOne({ email });
  if (!user) {
    return {
      status: 404,
      message: messages.users.userNotExistsErr("email"),
    };
  }
  // generate new random token validation value
  const newToken = uid(config.get("user.tokenValidationLength"));
  user.tokenValidation = newToken;
  try {
    await user.save();
    return { status: 200, newToken };
  } catch (err) {
    return {
      status: 400,
      message: typeof err === "string" ? err : messages.general.unknownErr,
    };
  }
};
//------------------------------------------------------------------------------
const resetPassword = async (userInput: {
  email?: string;
  token?: string;
  userId?: string;
  oldPassword?: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<{ status: number; message: string }> => {
  /**
   * userInput either contains:
   * 1 - email and token incase reset password is called after forget password, so token is the token sent in forget password success
   *   - or userId and oldPassword when a logged in user tries to forget his password
   * 2 - and the new password and it's confirmation
   */
  const { email, token, userId, oldPassword, newPassword, confirmPassword } =
    userInput;
  let user: IUser | null;
  if (email) {
    // reset password of a not logged in user after forget password
    user = await User.findOne({ email });
    if (!user) {
      return {
        status: 404,
        message: messages.users.userNotExistsErr("email"),
      };
    }
    // validate on the forget password token
    if (user.tokenValidation !== token) {
      return {
        status: 400,
        message: messages.users.resetPasswordFailed,
      };
    }
  } else if (userId) {
    // reset password by a logged in user
    user = await User.findById(userId);
    if (!user) {
      return {
        status: 404,
        message: messages.users.userNotExistsErr("id"),
      };
    }
    // validate on the old password entered by user and the new password
    if (!oldPassword || !(await bcrypt.compare(oldPassword, user.password))) {
      return {
        status: 400,
        message: messages.users.wrongPasswordErr,
      };
    }
  } else {
    return {
      status: 400,
      message: messages.general.missingInputErr,
    };
  }
  // validate on the new password
  const { status, message, hashedPassword } = await validateAndHashPassword(
    newPassword,
    confirmPassword
  );
  if (status !== 200) {
    return { status, message: message || "" };
  }
  // update the password and the token
  try {
    if (hashedPassword) {
      // save the new password
      user.password = hashedPassword;
    }
    // generate new random token validation value
    const newToken = uid(config.get("user.tokenValidationLength"));
    user.tokenValidation = newToken;
    await user.save();
    return { status: 200, message: messages.users.passwordUpdatedSuccess };
  } catch (err) {
    return {
      status: 400,
      message: typeof err === "string" ? err : messages.general.unknownErr,
    };
  }
};
//------------------------------------------------------------------------------
export { createUser, signIn, forgetPassword, resetPassword };
