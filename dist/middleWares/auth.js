"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const message_js_1 = __importDefault(require("../utils/message.js"));
const user_js_1 = __importDefault(require("../models/user.js"));
const auth = async (req, res, next) => {
    var _a;
    // Get the token from the Authorization header
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    // If there's no token, return an error
    if (!token) {
        res.status(401).send({ message: message_js_1.default.auth.missingTokenErr });
        return;
    }
    try {
        // Verify the token using the JWT secret key
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.get("secrets.jwtPrivateKey"));
        const { user, tokenValidation } = decoded;
        // check that token validation key is the same saved in user obj in db
        // to make sure that the user didn't log out or change password from another device
        const dbUser = await user_js_1.default.findById(decoded.user.id).lean();
        let dbTokenValidation;
        if (dbUser) {
            ({ tokenValidation: dbTokenValidation } = dbUser);
        }
        if (dbTokenValidation !== tokenValidation) {
            res.status(401).send({ message: message_js_1.default.auth.tokenExpiredErr });
            return;
        }
        // Add the decoded user object to the request object for further use
        req.user = decoded.user;
        // Call the next middleware function
        next();
    }
    catch (err) {
        const { name, message } = err;
        // If the token is invalid, return an error
        res.status(401).send({ message: `${name}: ${message}` });
        return;
    }
};
exports.default = auth;
