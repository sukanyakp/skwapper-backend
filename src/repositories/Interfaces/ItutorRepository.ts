import {  ITutorial } from "../../models/tutor/TutorialModel";
import { Iuser } from "../../models/user/userModel";

interface TutorApplicationData {
  title: string;
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
}
