import { createModel } from "@ticketing/backend-core";
import { Document } from "mongoose";

interface TicketAttributes {
  title: string;
  price: number;
}

export type TicketDocument = Document & TicketAttributes;

export const Ticket = createModel<TicketAttributes, TicketDocument>("Ticket", {
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});
