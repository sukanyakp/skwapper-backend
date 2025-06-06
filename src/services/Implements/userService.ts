import { UserRepository } from "../../repositories/Implements/userRepository";
import { IuserRepository } from "../../repositories/Interfaces/IuserRepository";
import { Iuser } from "../../models/user/userModel";
import { IuserService } from "../Interfaces/IuserService";
import redisClient from "../../config/redis";
import { generateOTP } from "../../utils/otp.util";
import { sendOtpEmail } from "../../utils/email.util";
// import { generateToken } from "../../utils/jwt.util";


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

    const value = await redisClient.get(key);
if (!value) {
  throw new Error(`Redis GET returned null for key: ${key}`);
}

const parsedValue: Iuser & { otp: string } = JSON.parse(value);
console.log(" Successfully stored in Redis:", parsedValue);

  
  await sendOtpEmail(user.email, otp);
  return otp

  } catch (error) {
    console.log(error);
    throw new Error("User registration failed");
  }
}


async verifyOtp(email: string, otp: string): Promise<Iuser> {
  const key = `user-register:${email}`;
  const data = await redisClient.get(key);

  if (!data) {
    throw new Error(`No OTP found for email: ${email}`);
  }

  const parsedValue: Iuser & { otp?: string } = JSON.parse(data);

  if (parsedValue.otp !== otp) {
    throw new Error("Incorrect OTP");
  }

  // Check if user already exists
  const existingUser = await this.UserRepository.findByEmail(email);
  if (existingUser) {
    throw new Error("User already registered with this email");
  }

  delete parsedValue.otp;

  const userToCreate: Iuser = parsedValue;

  const savedUser = await this.UserRepository.createUser(userToCreate);

  await redisClient.del(key);
  return savedUser;
}



 async resendOtp(email: string): Promise<void> {
  console.log('Reached at resend otp');
  
  const key = `user-register:${email}`;

  const data = await redisClient.get(key);
  if (!data) {
    throw new Error("No pending registration found for this email");
  }

  const parsedValue : Iuser & { otp ?: string } = JSON.parse(data);

  const newOtp = generateOTP();
  console.log('otp genrated in resendOtp');
  
  parsedValue.otp = newOtp;

  await redisClient.set(key, JSON.stringify(parsedValue), {
    EX: 300, // 5 mins
  });

  await sendOtpEmail(email, newOtp);
  console.log(`New OTP resent to ${email}:`, newOtp);
}


 
}


