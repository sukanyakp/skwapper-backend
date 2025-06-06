import { Iuser } from "../../models/user/userModel";

export interface IuserService {
  register (userData : Iuser) : Promise <string> // returns OTP
  verifyOtp(email:string,otp:string) : Promise <Iuser>
  resendOtp(email: string): Promise<void> 
  // login(email:string,password:string) : Promise<{token : string; user : Iuser}> 
}