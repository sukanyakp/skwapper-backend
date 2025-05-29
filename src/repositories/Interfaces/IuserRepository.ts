import { Iuser } from "../../models/user/userModel";

export interface IuserRepository {
    createUser(userData :Iuser) : Promise<Iuser> 
    findByEmail(email : string) : Promise<Iuser | null>

}