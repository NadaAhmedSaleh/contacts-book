"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const config_1 = __importDefault(require("config"));
const message_1 = __importDefault(require("../utils/message"));
// Create the schema
const userSchema = new mongoose_1.Schema({
    fullName: {
        type: String,
        unique: true,
        validate: {
            validator: function isFullNameValid(v) {
                /**
                 * the user name validation is:
                 * - word length can be [5,30]
                 */
                return new RegExp(config_1.default.get("regex.fullName")).test(v);
            },
            message: (props) => message_1.default.general.invalidFieldErr(props.value, "Full name", message_1.default.general.fieldsRegex.fullName(5, 30)),
        },
        required: [true, message_1.default.general.missingFieldErr("Full name")],
        index: true,
    },
    email: {
        type: String,
        unique: true,
        validate: {
            validator: function isValidEmail(v) {
                /**
                 * the user name validation is:
                 * - it includes an "@" symbol
                 * - it has a domain name with at least two letters (such as ".com" or ".org")
                 * - it doesn't include any invalid characters (such as spaces or special characters other than periods, underscores, percent signs, plus signs, or hyphens.)
                 */
                return new RegExp(config_1.default.get("regex.email")).test(v);
            },
            message: (props) => message_1.default.general.invalidFieldErr(props.value, "email", message_1.default.general.fieldsRegex.email),
        },
        required: [true, message_1.default.general.missingFieldErr("Email")],
        index: true,
    },
    password: {
        // the password validation is not done here as the one saved in db is hashed
        type: String,
        required: [true, message_1.default.general.missingFieldErr("Password")],
    },
    phoneNumber: {
        type: String,
        validate: {
            validator: function isValidPhoneNumber(v) {
                /**
                 * some of the phone numbers that matches this regex:
                 * - +1 123-456-7890
                 * - 1 (123) 456-7890
                 * - 123.456.7890
                 * - 44 1234567890
                 */
                return new RegExp(config_1.default.get("regex.phoneNumber")).test(v);
            },
            message: (props) => message_1.default.general.invalidFieldErr(props.value, "phone number"),
        },
    },
    tokenValidation: {
        // this is a random key that updated on logout and changing password to expire the old tokens
        type: String,
    },
}, { timestamps: true });
// Create and export the model
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
