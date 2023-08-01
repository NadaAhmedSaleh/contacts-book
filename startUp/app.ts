import express, { Express } from "express";
import usersRoutes from "../routes/authentication";

const app: Express = express();
app.use(express.json()); // to parse request bodies

app.use("/auth", usersRoutes);

export default app;
