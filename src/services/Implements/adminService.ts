
import { IAdminService } from "../Interfaces/IadminService";
import User from "../../models/user/userModel";
import { IAdminRepository } from "../../repositories/Interfaces/IadminRepository";
import TutorApplicationModel from "../../models/tutor/tutorApplicationModel";


export interface CourseData {
  title: string;
  description : string
  // song: string;
  // movie: string;
  // instrument: string;
  // videoUrl: string;
  // tutorId: Schema.Types.ObjectId; // or string if that's how you use it
  // language?: string | null; // <-- Allow null
  // add other fields if needed
}


export class AdminService implements IAdminService {

    private UserRepository: IAdminRepository;

    constructor(UserRepository: IAdminRepository) {
            this.UserRepository = UserRepository;
          }

 public async getTutors(): Promise<any[]> {
    return User.find({ role: "tutor" });
  }

  public async updateTutorStatus(id: string, action: string): Promise<any> {
    if (!["block", "unblock"].includes(action)) return null;

    const isBlocked = action === "block";
    return User.findByIdAndUpdate(id, { isBlocked }, { new: true });
  }




  // 🆕 Get all pending tutor applications
  public async getTutorApplications(): Promise<any[]> {
      const raw = await TutorApplicationModel.find();

    const res = await TutorApplicationModel.find({  }).populate("user", "name email ");
    // console.log('res' , res);
    
    return res
  }

  // 🆕 Approve or reject a tutor application
  public async reviewTutorApplication(
    applicationId: string,
    action: "approved" | "rejected",
    // adminId: string,
    rejectionReason?: string
  ): Promise<any> {
    const application = await TutorApplicationModel.findById(applicationId);
    if (!application) return null;

    const userId = application.user;

    // Update application
    application.status = action;
    // application.reviewedBy = adminId;
    // application.reviewedAt = new Date();
    // if (action === "rejected" && rejectionReason) {
    //   application.rejectionReason = rejectionReason;
    // }

    await application.save();

    // Update User document
    await User.findByIdAndUpdate(userId, {
      status: action,
      isApproved: action === "approved"
    });

    return application;
  }

  public async getTutorApplicationById(applicationId: string): Promise<any | null> {
  const application = await TutorApplicationModel.findById(applicationId).populate("user", "name email");
  return application; // returns null if not found
}

public async toggleBlockUser(userId: string, block: boolean) {
    const user = await this.UserRepository.toggleBlockStatus(userId, block);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }





public async createCourse  (data: CourseData) : Promise<any> {
  return await this.UserRepository.saveCourse(data);
};


}
