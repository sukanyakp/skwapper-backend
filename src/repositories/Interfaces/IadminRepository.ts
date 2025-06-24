import { Iuser } from "../../models/user/userModel";


export interface IAdminRepository {
    createAdmin(adminData: Iuser): Promise<Iuser>
    findByEmail(email : string) : Promise<Iuser | null>
    findByRole(role : string) : Promise<Iuser[] > 
    findById(id : string) : Promise < Iuser | null > 
    tutorBlockStatus(userId: string, block: boolean): Promise<Iuser | null>
    userBlockStatus(userId : string,block : boolean) : Promise <Iuser | null>
    getAllUsers(): Promise<Iuser[]> 
    
}