import { UserRepository } from "../../repositories/Implements/userRepository";
import { IuserRepository } from "../../repositories/Interfaces/IuserRepository";
import { Iuser } from "../../models/user/userModel";
import { IuserService } from "../Interfaces/IuserService";
import redisClient from "../../config/redis";
import { generateOTP } from "../../utils/otp.util";
import { sendOtpEmail } from "../../utils/email.util";
import { comparePassword } from "../../utils/bcrypt.util";
import { generateToken } from "../../utils/jwt.util";


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
console.log("✅ Successfully stored in Redis:", parsedValue);

  
   await sendOtpEmail(user.email, otp);
  return otp

  } catch (error) {
    console.log(error);
    throw new Error("User registration failed");
  }
}



async verifyOtp(email: string, otp: string): Promise<Iuser> {
   
  const key = `user-register:${email}`
  console.log(key , 'is same key is creating ');
  
  const data = await redisClient.get(key)

  if (!data) {
  throw new Error(`Redis GET returned null for key: ${key}`);
}
  
const parsedValue: Iuser & { otp ?: string } = JSON.parse(data);

    if(parsedValue.otp !== otp) throw new Error("Incorrect OTP");

    delete parsedValue.otp; 

    const userToCreate : Iuser = parsedValue

    const savedUser = await this.UserRepository.createUser(userToCreate)
    await redisClient.del(key)
    return savedUser

 }

 async login (email :string, password : string) : Promise <{token : string; user : Iuser}> {

  console.log('here we are at the services ');
  
   const user = await this.UserRepository.findByEmail(email)

  if(!user){
    throw new Error('user not found')
  }

  const isPasswordValid = await comparePassword(password,user.password)
   if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  const token = generateToken({ id: user._id, email: user.email });
  console.log(token,'token');

  return { token, user };
 }

}


