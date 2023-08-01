import express from "express";
import usersRoutes from "../routes/authentication";

const app = express();
app.use(express.json()); // to parse request bodies

app.use("/auth", usersRoutes);

export default app;
