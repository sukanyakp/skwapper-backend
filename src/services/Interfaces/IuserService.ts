import { IScheduledSession } from "../../models/notification/scheduledSessionModel";
import { ITutorProfile } from "../../models/tutor/tutorProfile";

export interface IuserService {

  createStudentProfile(profileData: any,file: Express.Multer.File): Promise<any>
  getStudentProfile (userId: string) : Promise<any>
  getAllApprovedTutors(): Promise<ITutorProfile[]>
  getTutorById(tutorId: string) : Promise<ITutorProfile>
  createSessionRequestNotification(
  tutorId: string,
  studentId: string
  ): Promise<any>

  getRecommendedCourses(userId: string): Promise<any> 
  sessionRequests(studentId : string) : Promise<any>
  updateStudentProfile(
    userId: string,
    profileData: any,
    file?: Express.Multer.File
  ): Promise<any>
}