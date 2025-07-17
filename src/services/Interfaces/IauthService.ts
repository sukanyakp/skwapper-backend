import { UserDto } from "../../dto";
import { Iuser } from "../../models/user/userModel";

export interface IauthService {
  register (userData : Iuser) : Promise <string> // returns OTP
  login(email:string,password:string) : Promise<{accessToken : string; refreshToken : string ;   user: UserDto | null;}> 
  verifyOtp(email: string, otp: string): Promise<UserDto | null>
  resendOtp(email: string): Promise<void> 
  forgotPassword(email : string) : Promise <void>
  resetPassword(token : string , newPassword : string) : Promise<void>
  refreshToken(refreshToken: string): Promise<string> 
}