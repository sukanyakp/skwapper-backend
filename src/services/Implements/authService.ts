import { Iuser } from "../../models/user/userModel";
import { IuserRepository } from "../../repositories/Interfaces/IuserRepository";
import {hashPassword, comparePassword } from "../../utils/bcrypt.util"; 
import { generateAccessToken, generateRefreshToken ,generateResetToken }  from "../../utils/jwt.util"
import jwt from "jsonwebtoken";
import crypto from 'crypto'
import { sendResetEmail  } from "../../utils/email.util";


export class AuthService {
  private userRepository: IuserRepository;

  constructor(userRepository: IuserRepository) {
    this.userRepository = userRepository;
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

    console.log(user , 'here is the user ');
    

    // 2. Validate password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    // 3. Generate tokens
    const accessToken = generateAccessToken({ id: user._id, email: user.email });
    const refreshToken = generateRefreshToken({ id: user._id });

    // console.log( accessToken,'accessTokend ');
    // console.log( refreshToken,'accessTokend ');
    

    // 4. Optional: Store refreshToken in DB or cache (if revocation logic is needed)

    return {
      accessToken,
      refreshToken,
      user,
    };
  }

async forgotPassword(email: string): Promise<void> {
  const user = await this.userRepository.findByEmail(email);
  if (!user) throw new Error('User not found');

  // ✅ Generate JWT token
  const token = generateResetToken({ id: user._id, email: user.email });

  // ✅ Store token hash and expiry in DB for validation (optional, but good for blacklisting or expiry verification)
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  user.resetToken = hashedToken;
  user.tokenExpiry = Date.now() + 1000 * 60 * 15; // 15 minutes
  await user.save();

  // ✅ Send token in email
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


}
