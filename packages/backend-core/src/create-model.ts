import { model, Schema, Model, Document, SchemaDefinition } from "mongoose";

export const createModel = <I, D extends Document>(
  modelName: string,
  definition: SchemaDefinition
) => {
  type OModel = Model<D>;

  const OSchema = new Schema(definition, {
    toJSON: {
      versionKey: false,
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  });

  return model<D, OModel>(modelName, OSchema);
};
