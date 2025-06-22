import { Iuser } from "../../models/user/userModel";

export interface IuserService {

  createStudentProfile(profileData: any,file: Express.Multer.File): Promise<any>
  getStudentProfile (userId: string) : Promise<any>
}