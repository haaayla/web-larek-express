import mongoose from 'mongoose';
import validator from 'validator';
import { NAME_MIN_LENGTH, NAME_MAX_LENGTH, PASSWORD_MIN_LENGTH } from '../constants';

export interface IToken {
  token: string;
}

export interface IUser {
  name: string;
  email: string;
  password: string;
  tokens: IToken[];
}

const tokenSchema = new mongoose.Schema<IToken>({
  token: {
    type: String,
    required: [true, 'Поле "token" должно быть заполнено'],
  },
}, { _id: false });

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    default: 'Ё-мое',
    minlength: [NAME_MIN_LENGTH, `Минимальная длина поля "name" - ${NAME_MIN_LENGTH}`],
    maxlength: [NAME_MAX_LENGTH, `Максимальная длина поля "name" - ${NAME_MAX_LENGTH}`],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Поле "email" должно быть заполнено'],
    validate: {
      validator: (value: string) => validator.isEmail(value),
      message: 'Поле "email" должно быть валидным email-адресом',
    },
  },
  password: {
    type: String,
    required: [true, 'Поле "password" должно быть заполнено'],
    minlength: [PASSWORD_MIN_LENGTH, `Минимальная длина поля "password" - ${PASSWORD_MIN_LENGTH}`],
    select: false,
  },
  tokens: {
    type: [tokenSchema],
    select: false,
  },
});

export default mongoose.model<IUser>('user', userSchema);
