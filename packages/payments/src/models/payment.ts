import { Schema, Document, Model, model } from "mongoose";

interface PaymentAttributes {
  orderId: string;
  stripeChargeId: string;
}

type PaymentDocument = Document & PaymentAttributes;
type PaymentModel = Model<PaymentDocument>;

const paymentSchema = new Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    stripeChargeId: {
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

export const Payment = model<PaymentDocument, PaymentModel>(
  "Payment",
  paymentSchema
);
