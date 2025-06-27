import { Iuser } from "../../models/user/userModel";
import { IuserRepository } from "../../repositories/Interfaces/IuserRepository";
import {hashPassword, comparePassword } from "../../utils/bcrypt.util"; 
import { generateAccessToken, generateRefreshToken ,generateResetToken }  from "../../utils/jwt.util"
import jwt from "jsonwebtoken";
import { sendResetEmail  } from "../../utils/email.util";
import redisClient from "../../config/redis";
import { generateOTP } from "../../utils/otp.util";
import { sendOtpEmail } from "../../utils/email.util";



export class AuthService {
  private userRepository: IuserRepository;

  constructor(userRepository: IuserRepository) {
    this.userRepository = userRepository;
  }

async register(user: Iuser): Promise<string> {
  try {
    if (user.password) {
      user.password = await hashPassword(user.password);
    }

    const otp = generateOTP();
    const dataToStore = { ...user, otp };

    // Delegate to repository
    await this.userRepository.storeUserInRedis(user.email, dataToStore);

    await sendOtpEmail(user.email, otp);
    return otp;
  } catch (error) {
    console.log(error);
    throw new Error("User registration failed");
  }
}




  async login(email: string, password: string): Promise<{
    accessToken: string;
    refreshToken: string;
    user: Iuser;
  }> {
    console.log("Service: Login initiated");
    
    
    // 1. Find user
    const user = await this.userRepository.findByEmail(email);
    
    if (!user) {
      throw new Error("User not found");
    }
    
    console.log( user.role ,'role: user.role');
    console.log(user , 'here is the user ');
    console.log("Entered password:", password);
    console.log("Stored hash in DB:", user.password);

    
    // 2. Validate password
    const isPasswordValid = await comparePassword(password, user.password);
    console.log('a' ,isPasswordValid);

    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }
    console.log('b ,isPasswordValid');

    // 3. Generate tokens
    const accessToken = generateAccessToken({ id: user._id, email: user.email ,role: user.role});
    const refreshToken = generateRefreshToken({ id: user._id });
    

    // console.log( accessToken,'accessTokend ');
    // console.log( refreshToken,'accessTokend ');
    

    return {
      accessToken,
      refreshToken,
      user,
    };
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
  const existingUser = await this.userRepository.findByEmail(email);
  if (existingUser) {
    throw new Error("User already registered with this email");
  }

  delete parsedValue.otp;

  const userToCreate: Iuser = parsedValue;

  const savedUser = await this.userRepository.createUser(userToCreate);

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



async forgotPassword(email: string): Promise<void> {
  const user = await this.userRepository.findByEmail(email);
  if (!user) throw new Error('User not found');

  // Generate JWT token
  const token = generateResetToken({ id: user._id, email: user.email });


  // const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  // user.resetToken = hashedToken;
  // user.tokenExpiry = Date.now() + 1000 * 60 * 15; // 15 minutes
  // await user.save();

  // Send token in email
  const resetLink = `http://localhost:5173/reset-password/${token}`;
  await sendResetEmail(user.email, token);
}


async resetPassword(token: string, newPassword: string): Promise<void> {
  try {

    console.log('yeah this is resetPassword : : : ');
    
    const decoded : any = jwt.verify(token,process.env.RESET_PASSWORD_SECRET as string);
    
    console.log('here at the backend resetPassword');
    console.log(decoded , 'decodec');
    
    const user = await this.userRepository.findByEmail(decoded.email);
    if (!user) throw new Error("User not found");

    const hashed = await hashPassword(newPassword)

    user.password = hashed;
    await user.save();
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
}


  public async refreshToken(refreshToken: string): Promise<string> {
    try {
      const decoded: any = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);

      // Optional: fetch user to ensure validity (like if token was revoked)
      const user = await this.userRepository.findById(decoded.id); // .id 
      if (!user) {
        throw new Error("User not found");
      }


      // Generate a new access token
      const newAccessToken = generateAccessToken({ id: user._id, email: user.email ,role : user.role});
      return newAccessToken;
    } catch (error) {
      throw new Error("Invalid refresh token");
    }
  }

}
