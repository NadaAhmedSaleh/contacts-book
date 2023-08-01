"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgetPassword = exports.signIn = exports.createUser = void 0;
const config_1 = __importDefault(require("config"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const rand_token_1 = require("rand-token");
const http_errors_1 = require("http-errors");
const message_js_1 = __importDefault(require("../utils/message.js"));
const user_js_1 = __importDefault(require("../models/user.js"));
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
const validateAndHashPassword = async (password, confirmPassword) => {
    // check that both password and confirmPasswords strings are not empty
    if (!password) {
        return {
            status: 404,
            message: message_js_1.default.general.missingFieldErr("Password"),
        };
    }
    if (!confirmPassword) {
        return {
            status: 404,
            message: message_js_1.default.general.missingFieldErr("Confirmation password"),
        };
    }
    // check that both password and confirmation password have the same value
    if (password !== confirmPassword) {
        return {
            status: 400,
            message: message_js_1.default.users.notMatchingPasswordsErr,
        };
    }
    // check that entered password matches the password criteria
    if (!new RegExp(config_1.default.get("regex.password")).test(password)) {
        return {
            status: 400,
            message: message_js_1.default.general.invalidFieldErr(password, "Password", message_js_1.default.general.fieldsRegex.password),
        };
    }
    // if the entered password passed all the above checks return the hashed password
    const salt = await bcryptjs_1.default.genSalt(10);
    const hashedPassword = await bcryptjs_1.default.hash(password, salt);
    return {
        status: 200,
        hashedPassword,
    };
};
//------------------------------------------------------------------------------
// controllers functions
//------------------------------------------------------------------------------
const createUser = async (userObject) => {
    const { fullName, email, password, confirmPassword, phoneNumber } = userObject;
    // check fullName all required fields are entered
    if (!fullName || !email || !password || !confirmPassword) {
        return { status: 400, message: message_js_1.default.general.missingInputErr };
    }
    // validate on the password and generate the hashed value
    const { status, message, hashedPassword } = await validateAndHashPassword(password, confirmPassword);
    if (status !== 200) {
        return { status, message: message || "" };
    }
    // create the user and if any exception error caught in the model validation return status 400 and the err message
    const user = new user_js_1.default({
        fullName,
        email,
        password: hashedPassword,
        phoneNumber,
        tokenValidation: (0, rand_token_1.uid)(config_1.default.get("user.tokenValidationLength")),
    });
    try {
        await user.save();
        return {
            status: 200,
            message: message_js_1.default.users.userCreatedSuccess(fullName),
        };
    }
    catch (err) {
        let errMessage = "";
        if ((0, http_errors_1.isHttpError)(err)) {
            errMessage = err.message;
            if (err.code === 11000) {
                // this err code is returned when try to save doc with duplicate field of one of the fields with unique property
                var field = Object.keys(err.keyValue)[0]; // which field caused the error (username, email or phone number)
                var value = err.keyValue[field];
                errMessage = message_js_1.default.general.alreadyExistsFieldErr(value, field);
            }
        }
        return {
            status: 400,
            message: errMessage,
        };
    }
};
exports.createUser = createUser;
//------------------------------------------------------------------------------
const signIn = async (userObject) => {
    const { phoneNumber, email, password } = userObject; // user should enter either phone Number or email
    const userQuery = phoneNumber ? { phoneNumber } : { email };
    const user = await user_js_1.default.findOne(userQuery);
    if (!user || !(await bcryptjs_1.default.compare(password, user.password))) {
        return {
            status: 400,
            message: message_js_1.default.users.invalidCredentialsErr,
        };
    }
    //  generate the jwt token
    const accessToken = jsonwebtoken_1.default.sign({
        user: {
            email: user.email,
            id: user._id,
        },
        tokenValidation: user.tokenValidation,
    }, config_1.default.get("secrets.jwtPrivateKey"), { expiresIn: config_1.default.get("timers.tokenLifeSpan") });
    return { status: 200, accessToken };
};
exports.signIn = signIn;
//------------------------------------------------------------------------------
const forgetPassword = async (email) => {
    if (!email) {
        return {
            status: 400,
            message: message_js_1.default.general.missingInputErr,
        };
    }
    // validate that entered email is in the correct email format
    if (!new RegExp(config_1.default.get("regex.email")).test(email)) {
        return {
            status: 400,
            message: message_js_1.default.general.invalidFieldErr(email, "Email"),
        };
    }
    const user = await user_js_1.default.findOne({ email });
    if (!user) {
        return {
            status: 404,
            message: message_js_1.default.users.userNotExistsErr("email"),
        };
    }
    // generate new random token validation value
    const newToken = (0, rand_token_1.uid)(config_1.default.get("user.tokenValidationLength"));
    user.tokenValidation = newToken;
    try {
        await user.save();
        return { status: 200, newToken };
    }
    catch (err) {
        return {
            status: 400,
            message: typeof err === "string" ? err : message_js_1.default.general.unknownErr,
        };
    }
};
exports.forgetPassword = forgetPassword;
//------------------------------------------------------------------------------
const resetPassword = async (userInput) => {
    /**
     * userInput either contains:
     * 1 - email and token incase reset password is called after forget password, so token is the token sent in forget password success
     *   - or userId and oldPassword when a logged in user tries to forget his password
     * 2 - and the new password and it's confirmation
     */
    const { email, token, userId, oldPassword, newPassword, confirmPassword } = userInput;
    let user;
    if (email) {
        // reset password of a not logged in user after forget password
        user = await user_js_1.default.findOne({ email });
        if (!user) {
            return {
                status: 404,
                message: message_js_1.default.users.userNotExistsErr("email"),
            };
        }
        // validate on the forget password token
        if (user.tokenValidation !== token) {
            return {
                status: 400,
                message: message_js_1.default.users.resetPasswordFailed,
            };
        }
    }
    else if (userId) {
        // reset password by a logged in user
        user = await user_js_1.default.findById(userId);
        if (!user) {
            return {
                status: 404,
                message: message_js_1.default.users.userNotExistsErr("id"),
            };
        }
        // validate on the old password entered by user and the new password
        if (!oldPassword || !(await bcryptjs_1.default.compare(oldPassword, user.password))) {
            return {
                status: 400,
                message: message_js_1.default.users.wrongPasswordErr,
            };
        }
    }
    else {
        return {
            status: 400,
            message: message_js_1.default.general.missingInputErr,
        };
    }
    // validate on the new password
    const { status, message, hashedPassword } = await validateAndHashPassword(newPassword, confirmPassword);
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
        const newToken = (0, rand_token_1.uid)(config_1.default.get("user.tokenValidationLength"));
        user.tokenValidation = newToken;
        await user.save();
        return { status: 200, message: message_js_1.default.users.passwordUpdatedSuccess };
    }
    catch (err) {
        return {
            status: 400,
            message: typeof err === "string" ? err : message_js_1.default.general.unknownErr,
        };
    }
};
exports.resetPassword = resetPassword;
