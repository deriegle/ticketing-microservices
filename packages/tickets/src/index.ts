import mongoose from "mongoose";
import { app } from "./app";
import { EnvvarService } from "@ticketing/backend-core";
import { natsWrapper } from "@ticketing/tickets/src/nats-wrapper";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { OrderCancelledListener } from "./events/listeners/order-cancelled-listener";

const listeners = [OrderCreatedListener, OrderCancelledListener];

const main = async () => {
  EnvvarService.validateEnvvars([
    "JWT_KEY",
    "MONGO_URI",
    "NATS_CLUSTER_ID",
    "NATS_URL",
    "NATS_CLIENT_ID",
  ]);

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    listeners.forEach((listener) => new listener(natsWrapper.client).listen());

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

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      JWT_KEY: string;
      MONGO_URI: string;
      NATS_CLUSTER_ID: string;
      NATS_URL: string;
      NATS_CLIENT_ID: string;
    }
  }
}
