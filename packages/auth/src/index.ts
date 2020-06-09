import mongoose from "mongoose";
import { EnvvarService } from "@ticketing/backend-core";
import { app } from "./app";

const main = async () => {
  EnvvarService.validateEnvvars(["JWT_KEY", "MONGO_URI"]);

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
  } catch (e) {
    console.error(e);
  }

  app.listen(3000, () => console.log("@ticketing/auth listening on port 3000"));
};

main();
