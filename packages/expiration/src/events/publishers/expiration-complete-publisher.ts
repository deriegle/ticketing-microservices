import {
  BasePublisher,
  ExpirationCompleteEvent,
  Subjects,
} from "@ticketing/backend-core";

export class ExpirationCompletePublisher extends BasePublisher<
  ExpirationCompleteEvent
> {
  readonly subject = Subjects.ExpirationComplete;
}
