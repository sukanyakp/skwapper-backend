
import { IAdminService } from "../Interfaces/IadminService";
import User, { Iuser } from "../../models/user/userModel";
import { IAdminRepository } from "../../repositories/Interfaces/IadminRepository";
import TutorApplicationModel from "../../models/tutor/tutorApplicationModel";




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
    const user = await User.findById(userId)
    console.log(user , 'here is the user');
    
    
    // Update application
    application.status = action;
    
    if (!user) throw new Error("User not found");
    if(application.status == "approved"){
       user.role = 'tutor'
    }else{
       user.role = 'student'
    }

    await user.save();
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
  const existingUser = await User.findById(userId);

  if (!existingUser) {
    throw new Error("User not found");
  }
  console.log(existingUser.role ,'waht is the role of the user');
  

  let updatedUser;

  if (existingUser.role === "tutor") {
    updatedUser = await this.UserRepository.tutorBlockStatus(userId, block);
  } else {
    updatedUser = await this.UserRepository.userBlockStatus(userId, block);
  }

  return updatedUser;
}


    public async getAllUsers(): Promise<Iuser[]> {
    return this.UserRepository.getAllUsers();
  }







}
