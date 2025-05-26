import { UserRepository } from "../../repositories/Implements/userRepository";
import { IuserRepository } from "../../repositories/Interfaces/IuserRepository";
import { Iuser } from "../../models/user/User";
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
    console.log(otp,'otp is not creating ....');
    
    const key = `user-register:${user.email}`
    

    const dataToStore = {...user,otp}
    console.log(dataToStore ,'dataStore');
    
    await redisClient.set(key,JSON.stringify(dataToStore),{
      EX : 300 // 5 min                                                           
    })
    console.log(redisClient,'redisClient');
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
  console.log(data,'checking for data');
  

  if(!data) throw new Error("OTP have expired")

    const parsed = JSON.parse(data)

    if(parsed.otp !== otp) throw new Error("Incorrect OTP");

    delete parsed.otp;

    const userToCreate : Iuser = parsed

    const savedUser = await this.UserRepository.createUser(userToCreate)
    await redisClient.del(key)

    return savedUser

 }

 async login (email :string, password : string) : Promise <{token : string; user : Iuser}> {

   const user = await this.UserRepository.findByEmail(email)

  if(!user){
    throw new Error('user not found')
  }

  const isPasswordValid = await comparePassword(password,user.password)
   if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  const token = generateToken({ id: user._id, email: user.email });

  return { token, user };
 }

}


