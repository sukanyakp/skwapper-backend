import { UserRepository } from "../../repositories/Implements/userRepository";
import { IuserRepository } from "../../repositories/Interfaces/IuserRepository";
import { Iuser } from "../../models/user/User";
import { IuserService } from "../Interfaces/IuserService";
import redisClient from "../../config/redis";
import { generateOTP } from "../../utils/otp.util";


export class UserService implements IuserService {
      private UserRepository: IuserRepository;

      constructor(UserRepository: IuserRepository) {
        this.UserRepository = UserRepository;
      }

      async register(user: Iuser): Promise<string> {
  try {

    const otp = generateOTP();
    const key = `user-register:${user.email}`

    const dataToStore = {...user,otp}
    console.log(dataToStore ,'dataStore');
    
    await redisClient.set(key,JSON.stringify(dataToStore),{
      EX : 300 // 5 min
    })
    console.log(redisClient,'redisClient');
   return otp

  } catch (error) {
    console.log(error);
    throw new Error("User registration failed");
  }
}



async verifyOtp(email: string, otp: string): Promise<Iuser> {
   
  const key = `user-register:${email}`
  const data = await redisClient.get(key)

  if(!data) throw new Error("OTP have expired")

    const parsed = JSON.parse(data)

    if(parsed.otp !== otp) throw new Error("Incorrect OTP");

    delete parsed.otp;

    const userToCreate : Iuser = parsed

    const savedUser = await this.UserRepository.createUser(userToCreate)
    await redisClient.del(key)

    return savedUser

 }

}


