import { ItutorRepository } from "../Interfaces/ItutorRepository";
import { BaseRepository } from "./baseRepository";

import User, { Iuser } from "../../models/user/userModel";
import TutorApplication from "../../models/tutor/tutorApplicationModel";
import TutorialModel, { ITutorial } from "../../models/tutor/TutorialModel";
import Notification from "../../models/notification/notificationModel";
import Availability, { IAvailability } from "../../models/tutor/tutorAvailability";
import TutorProfile, { ITutorProfile } from "../../models/tutor/tutorProfile";
import scheduledSessionModel from "../../models/notification/scheduledSessionModel";
import Payment from "../../models/student/paymentModel";

interface TutorApplicationData {
  category: string;
  bio: string;
  skills: string;
  experience: string;
  documents: string[];
  status: string;
  isBlocked: boolean;
}

export class TutorRepository extends BaseRepository<Iuser> implements ItutorRepository {
  constructor() {
    super(User); // BaseRepository expects a model
  }

  //  Save or reject duplicate tutor applications
  public async saveTutorApplication(
    userId: string,
    data: TutorApplicationData
  ): Promise<{ alreadyApplied: boolean; application: any }> {
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
      status: "pending",
      isBlocked: false
    });

    const saved = await newApplication.save();

    return { alreadyApplied: false, application: saved };
  }

  // Get user by userId (can also be done via BaseRepository.findById)
  public async findByUserId(userId: string): Promise<Iuser | null> {
    return await User.findById(userId);
  }

  // Create a course
  public async createCourse(courseData: Partial<ITutorial>): Promise<ITutorial> {
    const newCourse = new TutorialModel(courseData);
    return await newCourse.save();
  }

  // Get courses by tutor
  public async findCoursesByTutorId(tutorId: string): Promise<ITutorial[]> {
    return await TutorialModel.find({ tutorId }).sort({ createdAt: -1 });
  }

  // Get session requests (from notifications)
  public async getSessionRequests(tutorId: string): Promise<any> {
    console.log(tutorId ,'tutorId at getsession req');

    const tutorProfileId = await User.findOne({_id : tutorId})
    console.log(tutorProfileId ,'TutorProfile');
    const id = tutorProfileId?.tutorProfileId 
    
    
    return await Notification.find({ recipientId : id }) //reciepient Id
      .populate("senderId", "name email")
      .sort({ createdAt: -1 });
  }

  // Save availability schedule
  public async saveAvailability(tutorId: string, data: any): Promise<IAvailability> {
    return await Availability.findOneAndUpdate(
      { tutorId },
      { availability: data },
      { upsert: true, new: true }
    );
  }

  // Get availability
  public async getAvailability(tutorId: string): Promise<IAvailability | null> {
    return await Availability.findOne({ tutorId });
  }

  //  Update tutor profile details
  public async updateTutorByUserId(
    userId: string,
    updateData: any
  ): Promise<ITutorProfile | null> {
    return await TutorProfile.findOneAndUpdate(
      { userId },
      updateData,
      { new: true, runValidators: true }
    );
  }



   public async approveRequest(tutorId: string, notificationId: string, scheduledTime: string): Promise<any> {
    const notification = await Notification.findById(notificationId);

    if (!notification) {
      throw new Error("Notification not found");
    }

    const session = await scheduledSessionModel.create({
      tutorId,
      studentId: notification.senderId,
      scheduledTime,
      status: "confirmed",
    });

    // Optionally update notification status or delete
    await Notification.findByIdAndDelete(notificationId);

    return session;
  }


//   async getSessionsByTutor(tutorId: string) : Promise<any>{
//     console.log(tutorId ,'tutorId');
//     Payment.find({  payment })
    
//     return await scheduledSessionModel.find({ tutorId })
//       .populate("studentId", "name email")
//       .populate("tutorId", "name email")
//       .sort({ scheduledTime: 1 });
//   }



async getSessionsByTutor(tutorId: string): Promise<any> {
  console.log(tutorId, "tutorId");

  const sessions = await scheduledSessionModel
    .find({ tutorId })
    .populate("studentId", "name email")
    .populate("tutorId", "name email")
    .sort({ scheduledTime: 1 });

  for (const session of sessions) {
    // Update the related payment's requestStatus to confirmed
    await Payment.updateOne(
      {
        tutorId: session.tutorId,
        studentId: session.studentId,
        requestStatus: "pending", // only update if not already confirmed
      },
      {
        $set: { requestStatus: "confirmed" },
      }
    );
  }

  return sessions;
}



}
