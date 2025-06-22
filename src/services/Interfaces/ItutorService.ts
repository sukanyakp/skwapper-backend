import { Iuser } from "../../models/user/userModel";

export interface ITutorService {
   applyForTutor(
  userId: string,
  files: Express.Multer.File[],
  formData: { title: string; bio: string; skills: string; experience: string }
): Promise<any> 

  createTutorProfile(profileData: any,file: Express.Multer.File): Promise<any>
  getTutorProfile (userId: string) : Promise<any>
}