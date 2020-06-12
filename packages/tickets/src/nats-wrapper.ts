import nats, { Stan } from "node-nats-streaming";

class NatsWrapper {
  private client?: Stan;

  connect(clusterId: string, clientId: string, url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client = nats.connect(clusterId, clientId, { url });

      this.client.on("connect", () => {
        console.log("Connected to NATS");
        resolve();
      });

      this.client.on("error", (err: Error) => {
        console.error("Failure to connect to NATS");
        reject(err);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();
