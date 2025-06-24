import {  ITutorial } from "../../models/tutor/TutorialModel";
import { Iuser } from "../../models/user/userModel";

export interface ITutorService {
   applyForTutor(
  userId: string,
  files: Express.Multer.File[],
  formData: { category: string; bio: string; skills: string; experience: string }
): Promise<any> 

  createTutorProfile(profileData: any,file: Express.Multer.File): Promise<any>
  getTutorProfile (userId: string) : Promise<any>
  createCourse  (
    data: any,
    file?: Express.Multer.File,
    tutorId?: string
  ): Promise<ITutorial> 

  getCoursesByTutor(tutorId: string) : Promise<ITutorial[]>
  getSessionRequests(tutorId: string) : Promise<string>
}