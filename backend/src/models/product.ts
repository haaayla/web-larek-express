import mongoose from 'mongoose';
import { TITLE_MIN_LENGTH, TITLE_MAX_LENGTH } from '../constants';

export interface IProductImage {
  fileName: string;
  originalName: string;
}

export interface IProduct {
  title: string;
  image: IProductImage;
  category: string;
  description?: string;
  price: number | null;
}

const productSchema = new mongoose.Schema<IProduct>({
  title: {
    type: String,
    unique: true,
    required: [true, 'Поле "title" должно быть заполнено'],
    minlength: [TITLE_MIN_LENGTH, `Минимальная длина поля "title" - ${TITLE_MIN_LENGTH}`],
    maxlength: [TITLE_MAX_LENGTH, `Максимальная длина поля "title" - ${TITLE_MAX_LENGTH}`],
  },
  image: {
    fileName: {
      type: String,
      required: [true, 'Поле "image.fileName" должно быть заполнено'],
    },
    originalName: {
      type: String,
      required: [true, 'Поле "image.originalName" должно быть заполнено'],
    },
  },
  category: {
    type: String,
    required: [true, 'Поле "category" должно быть заполнено'],
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    default: null,
  },
});

export default mongoose.model<IProduct>('product', productSchema);
