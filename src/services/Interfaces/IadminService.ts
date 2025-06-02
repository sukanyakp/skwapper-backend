import { Iuser } from "../../models/user/userModel";

export interface IAdminService {
    register(name: string , email : string , password : string ): Promise<Iuser | null> 
    login(email: string, password: string): Promise<Iuser | null>
   
}