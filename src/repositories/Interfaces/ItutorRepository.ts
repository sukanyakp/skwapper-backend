import { IAvailability } from "../../models/tutor/tutorAvailability";
import {  ITutorial } from "../../models/tutor/TutorialModel";
import { Iuser } from "../../models/user/userModel";

interface TutorApplicationData {
  category: string;
  bio: string;
  skills: string;
  experience: string;
  documents: string[];
}
export interface ItutorRepository {
  saveTutorApplication(userId: string, data: TutorApplicationData): Promise<any>;
  findByUserId(userId: string) : Promise<Iuser | null >
  createCourse  (courseData: Partial<ITutorial>): Promise<ITutorial>  
  findCoursesByTutorId(tutorId: string): Promise<ITutorial[]> 
  getSessionRequests(tutorId: string):Promise<any>

  saveAvailability(tutorId: string, data: any): Promise<IAvailability> 
  getAvailability(tutorId: string): Promise<IAvailability | null>
}
