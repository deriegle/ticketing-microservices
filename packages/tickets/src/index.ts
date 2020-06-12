import mongoose from "mongoose";
import { app } from "./app";
import { EnvvarService } from "@ticketing/backend-core";

const main = async () => {
  EnvvarService.validateEnvvars(["JWT_KEY", "MONGO_URI"]);

  try {
    await mongoose.connect(process.env.MONGO_URI!, {
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
