import mongoose from "mongoose";
import config from "config";

export default function initDB() {
  mongoose
    .connect(config.get("connections.mongo-connect"))
    .then(() => {
      console.log("connected to mongoose db");
    })
    .catch((err) => {
      console.log({ err });
    });
}
