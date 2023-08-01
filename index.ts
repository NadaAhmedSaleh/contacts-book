import app from "./startUp/app";
import initDB from "./startUp/db";

const port = process.env.PORT || 3000;

initDB();

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
