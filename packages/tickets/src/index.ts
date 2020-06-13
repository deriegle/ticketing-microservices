import mongoose from "mongoose";
import { app } from "./app";
import { EnvvarService } from "@ticketing/backend-core";
import { natsWrapper } from "@ticketing/tickets/src/nats-wrapper";

const main = async () => {
  EnvvarService.validateEnvvars(["JWT_KEY", "MONGO_URI"]);

  try {
    await natsWrapper.connect(
      "ticketing",
      "jfdkasjfdas",
      "https://nats-srv:4222"
    );

    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed");
      process.exit();
    });
    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

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
