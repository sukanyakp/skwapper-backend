// import User, { Iuser } from "../../models/user/userModel";
// import { IAuthRepository } from "../Interfaces/IauthRepository";
// import { BaseRepository } from "./baseRepository";
// import redisClient from "../../config/redis";

// export class AuthRepository extends BaseRepository<Iuser> implements IAuthRepository {
//   constructor() {
//     super(User);
//   }

//   async findByEmail(email: string): Promise<Iuser | null> {
//     return await User.findOne({ email });
//   }

//   async storeOtp(email: string, data: object): Promise<void> {
//     const key = `otp:${email}`;
//     await redisClient.set(key, JSON.stringify(data), { EX: 300 }); // 5 minutes
//   }

//   async getOtp(email: string): Promise<object | null> {
//     const key = `otp:${email}`;
//     const value = await redisClient.get(key);
//     return value ? JSON.parse(value) : null;
//   }

//   async deleteOtp(email: string): Promise<void> {
//     const key = `otp:${email}`;
//     await redisClient.del(key);
//   }

//   async storeResetToken(userId: string, token: string, expiry: Date): Promise<void> {
//     await User.findByIdAndUpdate(userId, {
//       resetToken: token,
//       resetTokenExpiry: expiry,
//     });
//   }

//   async clearResetToken(userId: string): Promise<void> {
//     await User.findByIdAndUpdate(userId, {
//       $unset: {
//         resetToken: "",
//         resetTokenExpiry: ""
//       }
//     });
//   }

//   // ( if you're implementing refresh token-based auth)
//   async saveRefreshToken(userId: string, token: string): Promise<void> {
//     const key = `refresh:${userId}`;
//     await redisClient.set(key, token, { EX: 7 * 24 * 60 * 60 }); // 7 days
//   }

//   async getRefreshToken(userId: string): Promise<string | null> {
//     const key = `refresh:${userId}`;
//     return await redisClient.get(key);
//   }

//   async removeRefreshToken(userId: string): Promise<void> {
//     const key = `refresh:${userId}`;
//     await redisClient.del(key);
//   }
// }
