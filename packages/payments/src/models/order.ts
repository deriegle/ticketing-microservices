import { Schema, Document, Model, model } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { OrderStatus } from "@ticketing/backend-core";

interface OrderAttributes {
  userId: string;
  status: OrderStatus;
  price: number;
}

type OrderDocument = Document &
  OrderAttributes & {
    version?: number;
  };

type OrderModel = Model<OrderDocument>;

const orderSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
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

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

export const Order = model<OrderDocument, OrderModel>("Order", orderSchema);
