import { IScheduledSession } from "../../models/notification/scheduledSessionModel";
import { IStudentProfile } from "../../models/student/studentModel";
import { ITutorApplication } from "../../models/tutor/tutorApplicationModel";
import { ITutorial } from "../../models/tutor/TutorialModel";
import { ITutorProfile } from "../../models/tutor/tutorProfile";
import { Iuser } from "../../models/user/userModel";
import { IBaseRepository } from "./IbaseRepository";

export interface IuserRepository extends IBaseRepository<Iuser> {
    storeUserInRedis(email: string, data: object): Promise<void>
    // createUser(userData : Iuser) : Promise<Iuser> 
    findByEmail(email : string) : Promise<Iuser | null>
    storeResetToken(userId: string, token: string, expiry: Date): Promise<void>;
    findById(userId: string): Promise<Iuser | null>
    findApprovedTutors(): Promise<ITutorProfile[]> 
    findTutorById(tutorId: string) : Promise<ITutorProfile | null>
    createNotification(
     tutorId: string,
     studentId: string,
     message: string
): Promise<any>


getCoursesByCategory(category: string): Promise<ITutorial[] | null> 
getSessionById(studentId : string) : Promise<IScheduledSession[] | null>

}