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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
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
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = yield usersService.createUser(req.body), { status } = _a, data = __rest(_a, ["status"]);
    res.status(status).send(data);
});
exports.signUp = signUp;
//------------------------------------------------------------------------------
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _b = yield usersService.signIn(req.body), { status } = _b, data = __rest(_b, ["status"]);
    res.status(status).send(data);
});
exports.signIn = signIn;
//------------------------------------------------------------------------------
const forgetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const _c = yield usersService.forgetPassword(email), { status } = _c, data = __rest(_c, ["status"]);
    res.status(status).send(data);
});
exports.forgetPassword = forgetPassword;
//------------------------------------------------------------------------------
const resetPasswordByToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _d = yield usersService.resetPassword(req.body), { status } = _d, data = __rest(_d, ["status"]);
    res.status(status).send(data);
});
exports.resetPasswordByToken = resetPasswordByToken;
//------------------------------------------------------------------------------
const authenticatedResetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = Object.assign({ userId: req.user.id }, req.body);
    const _e = yield usersService.resetPassword(user), { status } = _e, data = __rest(_e, ["status"]);
    res.status(status).send(data);
});
exports.authenticatedResetPassword = authenticatedResetPassword;
