import { model, Schema, Types, type HydratedDocument } from 'mongoose';

export type CartItem = {
  productId: Types.ObjectId;
  quantity: number;
};

export type UserData = {
  email: string;
  password: string;
  cart: {
    items: CartItem[];
  };
};

export type UserDocument = HydratedDocument<UserData>;

const userSchema = new Schema<UserData>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    cart: {
      items: [
        {
          productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
          },
          quantity: { type: Number, required: true, min: 1 }
        }
      ]
    }
  },
  { timestamps: true }
);

export const User = model<UserData>('User', userSchema);
