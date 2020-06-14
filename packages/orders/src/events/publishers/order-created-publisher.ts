import {
  BasePublisher,
  OrderCreatedEvent,
  Subjects,
} from "@ticketing/backend-core";

export class OrderCreatedPublisher extends BasePublisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
