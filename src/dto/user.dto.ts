export interface UserDto {
  id: string;
  name: string;
  email: string;
  role: string;
  isBlocked: boolean;
  status?: string;
}

import { Iuser } from "../models/user/userModel";

export const mapUserToDto = (user: Iuser): UserDto => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
  isBlocked: user.isBlocked ?? false,
  status: user.status,
});
