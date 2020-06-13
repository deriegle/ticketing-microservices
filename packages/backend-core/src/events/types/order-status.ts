export enum OrderStatus {
  /**
   * @constant Created
   *
   * Order is created but ticket has not been reserved
   */
  Created = "created",

  /**
   * @constant Cancelled
   *
   * - The ticket the order is trying to reserve has already been reserved
   * - The user cancels the order
   * - The order expires before payment
   */
  Cancelled = "cancelled",

  /**
   * @constant AwaitingPayment
   *
   * The order has successfully reserved the ticket
   */
  AwaitingPayment = "awaiting-payment",

  /**
   * @constant Complete
   *
   * The order has reserved the ticket and the user has provided payment successfully
   */
  Complete = "complete",
}
