import mongoose from "mongoose";
import { app } from "./app";
import { EnvvarService } from "@ticketing/backend-core";
import { natsWrapper } from "@ticketing/orders/src/nats-wrapper";
import { TicketUpdatedListener } from "./events/listeners/ticket-updated-listener";
import { TicketCreatedListener } from "./events/listeners/ticket-created-listener";
import { ExpirationCompleteListener } from "./events/listeners/expiration-complete-listener";
import { PaymentCreatedListener } from "./events/listeners/payment-created-listener";

const listeners = [
  TicketCreatedListener,
  TicketUpdatedListener,
  ExpirationCompleteListener,
  PaymentCreatedListener,
];

const main = async () => {
  try {
    EnvvarService.validateEnvvars([
      "JWT_KEY",
      "MONGO_URI",
      "NATS_CLUSTER_ID",
      "NATS_URL",
      "NATS_CLIENT_ID",
    ]);

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

    app.listen(3000, () =>
      console.log("@ticketing/orders listening on port 3000")
    );
  } catch (e) {
    console.error(e?.message ?? e);
  }
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
