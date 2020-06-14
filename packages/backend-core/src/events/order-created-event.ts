import { Subjects } from "@ticketing/backend-core/src/events/subjects";
import { OrderStatus } from "./types/order-status";

export interface OrderCreatedEvent {
  subject: Subjects.OrderCreated;
  data: {
    id: string;
    status: OrderStatus;
    userId: string;
    expiresAt: string;
    ticket: {
      id: string;
      price: number;
    };
  };
}
