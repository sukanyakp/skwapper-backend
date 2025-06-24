import { ItutorRepository } from "../Interfaces/ItutorRepository";
import TutorApplication from "../../models/tutor/tutorApplicationModel";
import { BaseRepository } from "./baseRepository";
import { Iuser } from "../../models/user/userModel";
import User from "../../models/user/userModel";
import TutorialModel, {  ITutorial } from "../../models/tutor/TutorialModel";

interface TutorApplicationData {
  category: string;
  bio: string;
  skills: string;
  experience: string;
  documents: string[];
  status : string
  isBlocked : Boolean
}

export class TutorRepository extends BaseRepository<Iuser> implements ItutorRepository {
  // Save tutor application
  public async saveTutorApplication(
    userId: string,
    data: TutorApplicationData
  ): Promise<any> {
    const existing = await TutorApplication.findOne({ user: userId });

    if (existing) {
      return { alreadyApplied: true, application: existing };
    }

    const newApplication = new TutorApplication({
      user: userId,
      documents: data.documents,
      title: data.category,
      bio: data.bio,
      skills: data.skills,
      experience: data.experience,
      status : 'pending',
      isBlocked : false
    });

    const saved = await newApplication.save();

    return { alreadyApplied: false, application: saved };
  }

  // Optionally find tutor application by user
  public async findByUserId(userId: string): Promise<Iuser | null> {
    return await User.findById(userId); 
  }


  public async createCourse  (courseData: Partial<ITutorial>): Promise<ITutorial>  {
  const newCourse = new TutorialModel (courseData);
  return await newCourse.save();
};


 async findCoursesByTutorId(tutorId: string): Promise<ITutorial[]> {
  console.log(tutorId ,'tutorId');
  
    return await TutorialModel.find({ tutorId }).sort({ createdAt: -1 });
  }

}
