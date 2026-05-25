import { model, Schema, Types, type HydratedDocument } from 'mongoose';

export type OrderedProduct = {
  product: {
    id: string;
    title: string;
    price: number;
    description: string;
    imageUrl: string;
  };
  quantity: number;
};

export type OrderData = {
  products: OrderedProduct[];
  user: {
    email: string;
    userId: Types.ObjectId;
  };
};

export type OrderDocument = HydratedDocument<OrderData>;

const orderSchema = new Schema<OrderData>(
  {
    products: [
      {
        product: { type: Object, required: true },
        quantity: { type: Number, required: true }
      }
    ],
    user: {
      email: { type: String, required: true },
      userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
    }
  },
  { timestamps: true }
);

export const Order = model<OrderData>('Order', orderSchema);
