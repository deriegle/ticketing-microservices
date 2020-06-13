import { model, Schema, Model, Document } from "mongoose";

interface OrderAttributes {
  title: string;
  price: number;
  userId: string;
}

type OrderDocument = Document & OrderAttributes;

interface OrderModel extends Model<OrderDocument> {
  build(attrs: OrderAttributes): OrderDocument;
}

const orderSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
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

orderSchema.statics.build = (attrs: OrderAttributes) => new Order(attrs);

export const Order = model<OrderDocument, OrderModel>("Order", orderSchema);
