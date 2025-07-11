import { IAvailability } from "../../models/tutor/tutorAvailability";
import {  ITutorial } from "../../models/tutor/TutorialModel";
import { ITutorProfile } from "../../models/tutor/tutorProfile";
import { Iuser } from "../../models/user/userModel";
import { IBaseRepository } from "./IbaseRepository";

interface TutorApplicationData  {
  category: string;
  bio: string;
  skills: string;
  experience: string;
  documents: string[];
}


export interface ItutorRepository extends IBaseRepository<Iuser> {
  saveTutorApplication(
    userId: string,
    data: any
  ): Promise<{ alreadyApplied: boolean; application: any }>;

  findByUserId(userId: string): Promise<Iuser | null>;

  createCourse(courseData: Partial<ITutorial>): Promise<ITutorial>;

  findCoursesByTutorId(tutorId: string): Promise<ITutorial[]>;

  getSessionRequests(tutorId: string): Promise<any>;

  saveAvailability(tutorId: string, data: any): Promise<IAvailability>;

  getAvailability(tutorId: string): Promise<IAvailability | null>;

  updateTutorByUserId(userId: string, updateData: any): Promise<ITutorProfile | null>;
  approveRequest(tutorId: string, notificationId: string, scheduledTime: string) : Promise<any>


   getSessionsByTutor(tutorId: string) : Promise<any>
}