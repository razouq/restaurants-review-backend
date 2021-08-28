import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  role: string;
}

const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (this: UserDocument) {
  const salt = randomBytes(8).toString('hex');

  const hash = (await scrypt(this.password, salt, 32)) as Buffer;

  const resultPassword = salt + '.' + hash.toString('hex');

  this.password = resultPassword;
});

export { UserSchema };
