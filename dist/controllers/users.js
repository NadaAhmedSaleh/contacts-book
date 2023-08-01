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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordByToken = exports.authenticatedResetPassword = exports.forgetPassword = exports.signIn = exports.signUp = void 0;
const usersService = __importStar(require("../services/users"));
const signUp = async (req, res) => {
    const _a = await usersService.createUser(req.body), { status } = _a, data = __rest(_a, ["status"]);
    res.status(status).send(data);
};
exports.signUp = signUp;
//------------------------------------------------------------------------------
const signIn = async (req, res) => {
    const _a = await usersService.signIn(req.body), { status } = _a, data = __rest(_a, ["status"]);
    res.status(status).send(data);
};
exports.signIn = signIn;
//------------------------------------------------------------------------------
const forgetPassword = async (req, res) => {
    const { email } = req.body;
    const _a = await usersService.forgetPassword(email), { status } = _a, data = __rest(_a, ["status"]);
    res.status(status).send(data);
};
exports.forgetPassword = forgetPassword;
//------------------------------------------------------------------------------
const resetPasswordByToken = async (req, res) => {
    const _a = await usersService.resetPassword(req.body), { status } = _a, data = __rest(_a, ["status"]);
    res.status(status).send(data);
};
exports.resetPasswordByToken = resetPasswordByToken;
//------------------------------------------------------------------------------
const authenticatedResetPassword = async (req, res) => {
    const user = Object.assign({ userId: req.user.id }, req.body);
    const _a = await usersService.resetPassword(user), { status } = _a, data = __rest(_a, ["status"]);
    res.status(status).send(data);
};
exports.authenticatedResetPassword = authenticatedResetPassword;
