import { Iuser } from "../../models/user/User";

export interface IuserService {
  register (userData : Iuser) : Promise <string> // returns OTP
  verifyOtp(email:string,otp:string) : Promise <Iuser>
  login(email:string,password:string) : Promise<{token : string; user : Iuser}> 
}