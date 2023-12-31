"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./startUp/app.cjs"));
const db_1 = __importDefault(require("./startUp/db.cjs"));
const port = process.env.PORT || 3000;
(0, db_1.default)();
app_1.default.listen(port, () => {
    console.log(`Listening on port ${port}!`);
});
