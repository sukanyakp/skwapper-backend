import User, { Iuser } from "../../models/user/userModel";
import { IuserRepository } from "../Interfaces/IuserRepository";
import { BaseRepository } from "./baseRepository";
import redisClient from "../../config/redis";

export class UserRepository extends BaseRepository<Iuser> implements IuserRepository {
  constructor() {
    super(User);
  }


  async storeUserInRedis(email: string, data: object): Promise<void> {
  const key = `user-register:${email}`;
  
  await redisClient.set(key, JSON.stringify(data), { EX: 300 });

  const value = await redisClient.get(key);
  if (!value) {
    throw new Error(`Redis   returned null for key: ${key}`);
  }

  const parsed = JSON.parse(value);
  console.log("Successfully stored in Redis:", parsed);
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

  async findById(userId: string): Promise<Iuser | null> {
  return User.findById(userId);
}

}
