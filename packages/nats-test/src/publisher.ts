import nats from "node-nats-streaming";

const client = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

client.on("connect", () => {
  console.log("Publisher has connected to NATS Streaming.");

  const data = JSON.stringify({
    id: "123",
    title: "Dermot Kennedy",
    price: 20,
  });

  client.publish("ticket:created", data, (err, id) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`ticket:created event published: ${id}`);
    }
  });
});
