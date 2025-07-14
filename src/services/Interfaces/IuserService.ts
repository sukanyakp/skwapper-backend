import { StudentProfileDto } from "../../dto/studentProfile.dto";
import { TutorProfileDto } from "../../dto/tutorProfile.dto";


export interface IuserService {

  createStudentProfile(profileData: any,file: Express.Multer.File): Promise<any>
  getStudentProfile (userId: string) : Promise<any>
  getAllApprovedTutors(): Promise<TutorProfileDto[]> 
  getTutorById(tutorId: string): Promise<TutorProfileDto | null> 
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
  ): Promise<StudentProfileDto | null>
}