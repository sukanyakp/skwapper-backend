import { Iuser } from "../../models/user/userModel";
import { CourseData } from "../../services/Implements/adminService";

export interface IAdminRepository {
    createAdmin(adminData: Iuser): Promise<Iuser>
    findByEmail(email : string) : Promise<Iuser | null>
    findByRole(role : string) : Promise<Iuser[] > 
    findById(id : string) : Promise < Iuser | null > 
    toggleBlockStatus(userId: string, block: boolean): Promise<Iuser | null>
    saveCourse  (data: any) : Promise<CourseData | null> 
}