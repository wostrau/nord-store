import { model, Schema, Types, type HydratedDocument } from 'mongoose';

export type ProductData = {
  title: string;
  price: number;
  description: string;
  imageUrl: string;
  userId: Types.ObjectId;
};

export type ProductDocument = HydratedDocument<ProductData>;

const productSchema = new Schema<ProductData>(
  {
    title: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, required: true, trim: true },
    imageUrl: { type: String, required: true, trim: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

export const Product = model<ProductData>('Product', productSchema);
