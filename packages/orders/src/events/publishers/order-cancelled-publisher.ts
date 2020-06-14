import {
  BasePublisher,
  Subjects,
  OrderCancelledEvent,
} from "@ticketing/backend-core";

export class OrderCancelledPublisher extends BasePublisher<
  OrderCancelledEvent
> {
  readonly subject = Subjects.OrderCancelled;
}
