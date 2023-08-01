import { Request, Response, NextFunction } from "express";
import config from "config";
import jwt from "jsonwebtoken";

import messages from "../utils/message.js";
import User from "../models/user.js";

// Custom type that extends the express.Request type to include the user property
interface AuthenticatedRequest extends Request {
  user: {
    id: string; // You can add more properties from the user if needed
  };
}

const auth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  // Get the token from the Authorization header
  const token = req.headers.authorization?.split(" ")[1];

  // If there's no token, return an error
  if (!token) {
    res.status(401).send({ message: messages.auth.missingTokenErr });
    return;
  }

  try {
    // Verify the token using the JWT secret key
    const decoded = jwt.verify(token, config.get("secrets.jwtPrivateKey")) as {
      user: {
        id: string;
      };
      tokenValidation: string;
    };

    const { user, tokenValidation } = decoded;
    // check that token validation key is the same saved in user obj in db
    // to make sure that the user didn't log out or change password from another device
    const dbUser = await User.findById(decoded.user.id).lean();
    let dbTokenValidation;
    if (dbUser) {
      ({ tokenValidation: dbTokenValidation } = dbUser);
    }
    if (dbTokenValidation !== tokenValidation) {
      res.status(401).send({ message: messages.auth.tokenExpiredErr });
      return;
    }

    // Add the decoded user object to the request object for further use
    req.user = decoded.user;

    // Call the next middleware function
    next();
  } catch (err) {
    const { name, message } = err as Error;
    // If the token is invalid, return an error
    res.status(401).send({ message: `${name}: ${message}` });
    return;
  }
};

export default auth;
export { AuthenticatedRequest };
