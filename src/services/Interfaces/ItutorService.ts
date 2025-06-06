import { Iuser } from "../../models/user/userModel";

export interface ITutorService {
   applyForTutor(files: Express.Multer.File[]): Promise<any> 
}