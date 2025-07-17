import User, { Iuser } from "../../models/user/userModel";
import { IuserRepository } from "../Interfaces/IuserRepository";
import { BaseRepository } from "./baseRepository";
import redisClient from "../../config/redis";
import TutorProfile, { ITutorProfile } from "../../models/tutor/tutorProfile";
import Notification from "../../models/notification/notificationModel";
import TutorialModel, { ITutorial } from "../../models/tutor/TutorialModel";
import StudentProfile, { IStudentProfile } from "../../models/student/studentModel";
import scheduledSessionModel, { IScheduledSession } from "../../models/notification/scheduledSessionModel";
import mongoose from "mongoose";
import { log } from "util";

export class UserRepository extends BaseRepository<Iuser> implements IuserRepository {
  constructor() {
    super(User);
  }

  async storeUserInRedis(email: string, data: object): Promise<void> {
    const key = `user-register:${email}`;
    await redisClient.set(key, JSON.stringify(data), { EX: 300 });

    const value = await redisClient.get(key);
    if (!value) {
      throw new Error(`Redis returned null for key: ${key}`);
    }

    const parsed = JSON.parse(value);
    console.log("Successfully stored in Redis:", parsed);
  }

  async storeResetToken(userId: string, token: string, expiry: Date): Promise<void> {
    await User.findByIdAndUpdate(userId, {
      resetToken: token,
      resetTokenExpiry: expiry,
    });
  }

async findApprovedTutors(): Promise<ITutorProfile[]> {
  const tutors = await TutorProfile.find().sort({ createdAt: -1 });
  return tutors as unknown as ITutorProfile[];   // used unknown  -:   We use unknown to forcefully cast Mongoose results to match the expected TypeScript type.
}

  public async findTutorById(tutorId: string): Promise<ITutorProfile | null> {
    return await TutorProfile.findById(tutorId);
  }

  public async createNotification(
    tutorId: string,
    studentId: string,
    message: string
  ): Promise<any> {
    return await Notification.create({
      recipientId: tutorId,
      senderId: studentId,
      message,
    });
  }



   public async getCoursesByCategory(category: string): Promise<ITutorial[] | null> {
    console.log('getcourseCategory at userRepository ; ; ' ,category);
    
    return await TutorialModel.find({ category });
  }

public async getSessionById(studentId: string): Promise<any[]> {
  return await scheduledSessionModel.aggregate([
    {
      $match: {
        studentId: new mongoose.Types.ObjectId(studentId),
      },
    },
    {
      $lookup: {
        from: "tutorprofiles", // ⚠️ should match actual MongoDB collection name
        localField: "tutorId",
        foreignField: "_id",
        as: "tutorProfile",
      },
    },
    {
      $unwind: "$tutorProfile" // Optional: if you want a single object instead of array
    },
  ]);
}


 async findByUserId(userId: string): Promise<any> {
    const res= await User.findOne({  userId });
    // console.log(res , 'result of findBYUseif');
    return res
    
  }

  async updateProfile(userId: string, updatedFields: any) : Promise<any>{

     const updatedProfile = await StudentProfile.findOneAndUpdate(
          { userId },
          updatedFields,
          { new: true }
        );
    return updatedProfile
    
  }

}
