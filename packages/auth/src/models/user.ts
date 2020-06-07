import { model, Schema, Model, Document } from 'mongoose';
import { PasswordService } from '@ticketing/auth/src/services/password-service';

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

userSchema.pre('save', async function(done) {
  if (this.isModified('password')) {
    const hashed = await PasswordService.hash(this.get('password'));
    this.set('password', hashed);
  }

  done();
});

userSchema.statics.build = (attrs: UserAttributes) => new User(attrs);

export const User = model<UserDocument, UserModel>('User', userSchema);

User.build({
  email: 'd@d.com',
  password: '1234',
});