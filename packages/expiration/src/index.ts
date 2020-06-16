import { EnvvarService } from "@ticketing/backend-core";
import { natsWrapper } from "@ticketing/tickets/src/nats-wrapper";

const main = async () => {
  EnvvarService.validateEnvvars([
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

    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed");
      process.exit();
    });
    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());
  } catch (e) {
    console.error(e);
  }
};

main();

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NATS_CLUSTER_ID: string;
      NATS_URL: string;
      NATS_CLIENT_ID: string;
    }
  }
}
