import { SessionDto } from "../../dto/session.dto";
import { TutorProfileDto } from "../../dto/tutorProfile.dto";
import { IAvailability } from "../../models/tutor/tutorAvailability";
import {  ITutorial } from "../../models/tutor/TutorialModel";
import { ITutorProfile } from "../../models/tutor/tutorProfile";
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
  getSessionRequests(tutorId: string) :Promise<SessionDto | null>

  setTutorAvailability(tutorId: string, availability: any): Promise<IAvailability>
  getTutorAvailability(tutorId: string): Promise<IAvailability | null>

  updateProfile(userId: string, profileData: any, file?: Express.Multer.File) : Promise<TutorProfileDto | null>

  approveRequest(tutorId: string, notificationId: string, scheduledTime: string) : Promise<any>
  getTutorSessions(tutorId: string): Promise<SessionDto | null> 
}