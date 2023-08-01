"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authentication_1 = __importDefault(require("../routes/authentication"));
const app = (0, express_1.default)();
app.use(express_1.default.json()); // to parse request bodies
app.use("/auth", authentication_1.default);
exports.default = app;
