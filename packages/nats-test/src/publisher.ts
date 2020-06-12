import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";

console.clear();

const client = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

client.on("connect", async () => {
  console.log("Publisher has connected to NATS Streaming.");
  const publisher = new TicketCreatedPublisher(client);

  await publisher.publish({
    id: "123",
    title: "Dermot Kennedy",
    price: 20,
  });

  // const data = JSON.stringify({
  //   id: "123",
  //   title: "Dermot Kennedy",
  //   price: 20,
  // });

  // client.publish("ticket:created", data, (err, id) => {
  //   if (err) {
  //     console.error(err);
  //   } else {
  //     console.log(`ticket:created event published: ${id}`);
  //   }
  // });
});
