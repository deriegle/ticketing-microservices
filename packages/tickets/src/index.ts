import mongoose from "mongoose";
import { app } from "./app";

const main = async () => {
  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
  } catch (e) {
    console.error(e);
  }

  app.listen(3000, () =>
    console.log("@ticketing/tickets listening on port 3000")
  );
};

main();
