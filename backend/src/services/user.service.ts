import type { UserDocument } from '../models/user.model.js';

export type UserResponse = {
  id: string;
  email: string;
};

export const toUserResponse = (user: UserDocument): UserResponse => ({
  id: user.id,
  email: user.email
});
