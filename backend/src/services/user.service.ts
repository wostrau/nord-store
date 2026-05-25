import type { User as UserResponse } from '@shared/types';

import type { UserDocument } from '../models/user.model.js';

export const toUserResponse = (user: UserDocument): UserResponse => ({
  id: user.id,
  email: user.email
});
