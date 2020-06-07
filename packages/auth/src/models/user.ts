import { model, Schema, Model, Document } from 'mongoose';

interface UserAttributes {
  email: string;
  password: string;
}

type UserDocument = Document & UserAttributes;

interface UserModel extends Model<UserDocument> {
  build(attrs: UserAttributes): UserDocument;
}

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  }
})

userSchema.statics.build = (attrs: UserAttributes) => new User(attrs);

export const User = model<UserDocument, UserModel>('User', userSchema);

User.build({
  email: 'd@d.com',
  password: '1234',
});