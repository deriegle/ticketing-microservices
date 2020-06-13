import { Schema, Document } from "mongoose";
import { OrderStatus, createModel } from "@ticketing/backend-core";
import { TicketDocument } from "./ticket";

interface OrderAttributes {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDocument;
}

type OrderDocument = Document & OrderAttributes;

export const Order = createModel<OrderAttributes, OrderDocument>("Order", {
  userId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(OrderStatus),
    required: true,
  },
  expiresAt: {
    type: Schema.Types.Date,
  },
  ticket: {
    type: Schema.Types.ObjectId,
    ref: "Ticket",
  },
});
