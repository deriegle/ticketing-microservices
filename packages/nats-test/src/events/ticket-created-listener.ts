import { Listener } from "./base-listener";
import { Message } from "node-nats-streaming";

export class TicketCreatedListener extends Listener {
  subject: string = "ticket:created";
  queueGroupName: string = "payments-service";

  onMessage(data: object, message: Message): void {
    console.log(`data: `, data);
    message.ack();
  }
}
