import { OrderStatus } from "@ticketing/backend-core";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { Document, Model, Schema, model } from "mongoose";
import { Order } from "./order";

interface TicketAttributes {
  title: string;
  price: number;
}

export type TicketDocument = Document &
  TicketAttributes & {
    version: number;
    isReserved: () => Promise<boolean>;
  };

type TicketModel = Model<TicketDocument>;

const ticketSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    toJSON: {
      versionKey: false,
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.methods.isReserved = async function (): Promise<boolean> {
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });

  return !!existingOrder;
};

export const Ticket = model<TicketDocument, TicketModel>(
  "Ticket",
  ticketSchema
);
