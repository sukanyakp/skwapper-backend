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
}