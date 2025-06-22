import { Iuser } from "../../models/user/userModel";

export interface ITutorService {
   applyForTutor(
  userId: string,
  files: Express.Multer.File[],
  formData: { title: string; bio: string; skills: string; experience: string }
): Promise<any> 
}