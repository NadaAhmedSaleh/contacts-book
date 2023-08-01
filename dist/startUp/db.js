"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("config"));
function initDB() {
    mongoose_1.default
        .connect(config_1.default.get("connections.mongo-connect"))
        .then(() => {
        console.log("connected to mongoose db");
    })
        .catch((err) => {
        console.log({ err });
    });
}
exports.default = initDB;
