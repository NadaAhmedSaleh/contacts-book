import config from "config";

console.log({ nada: config.get("regex.fullName") });

console.log(new RegExp(config.get("regex.fullName")).test("Joh"));
