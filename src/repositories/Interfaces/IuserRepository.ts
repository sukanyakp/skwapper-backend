import { Iuser } from "../../models/user/userModel";

export interface IuserRepository {
    storeUserInRedis(email: string, data: object): Promise<void>
    createUser(userData : Iuser) : Promise<Iuser> 
    findByEmail(email : string) : Promise<Iuser | null>
    storeResetToken(userId: string, token: string, expiry: Date): Promise<void>;
    findById(userId: string): Promise<Iuser | null>
}