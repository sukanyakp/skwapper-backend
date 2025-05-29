import { Iuser } from "../../models/user/userModel";

export interface IauthService {
  login(email:string,password:string) : Promise<{accessToken : string; refreshToken : string ; user : Iuser}> 
}