import User, { Iuser } from "../../models/user/userModel";
import { IuserRepository } from "../Interfaces/IuserRepository";
import { BaseRepository } from "./baseRepository";

export class UserRepository extends BaseRepository<Iuser> implements IuserRepository {
  constructor() {
    super(User);
  }

  async createUser(userData: Iuser): Promise<Iuser> {
    return  await this.create(userData);
  }

  async findByEmail(email: string): Promise<Iuser | null> {
    return User.findOne({ email });
  }

  async storeResetToken(userId: string, token: string, expiry: Date): Promise<void> {
    await User.findByIdAndUpdate(userId, {
      resetToken: token,
      resetTokenExpiry: expiry,
    });
  }

}
