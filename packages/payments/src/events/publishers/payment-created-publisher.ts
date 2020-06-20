import {
  BasePublisher,
  PaymentCreatedEvent,
  Subjects,
} from "@ticketing/backend-core";

export class PaymentCreatedPublisher extends BasePublisher<
  PaymentCreatedEvent
> {
  readonly subject = Subjects.PaymentCreated;
}
