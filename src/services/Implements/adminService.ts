
import { IAdminService } from "../Interfaces/IadminService";
import User from "../../models/user/userModel";
import { IAdminRepository } from "../../repositories/Interfaces/IadminRepository";
import TutorApplicationModel from "../../models/tutor/tutorApplicationModel";

export class AdminService implements IAdminService {

    private UserRepository: IAdminRepository;

    constructor(UserRepository: IAdminRepository) {
            this.UserRepository = UserRepository;
          }
    
  
//   public async register(name: string, email: string, password: string): Promise<Iuser | null> {
//   const existingUser = await this.UserRepository.findByEmail(email);
//   console.log(existingUser?.role , 'existingUser.role');
  

//   if (existingUser) {
//     // If already admin, return null 
//     if (existingUser.role === "admin") {
//       return null;
//     }

//     // Update role to admin if not already
//     existingUser.role = "admin";
//     await existingUser.save();
//     return existingUser;
//   }

//   // New admin registration
//   const hashedPassword = await bcrypt.hash(password, 10);
//   const newAdmin = new User({
//     name,
//     email,
//     password: hashedPassword,
//     role: "admin", // explicitly set role to admin
//   });

//   await newAdmin.save();
//   return newAdmin;
// }



// public async login(email: string, password: string): Promise<{
//   accessToken: string;
//   refreshToken: string;
//   admin: Iuser;
// } | null> {
//   const user = await this.UserRepository.findByEmail(email);

//   // Validate admin user
//   if (!user || user.role !== 'admin') return null;

//   const isMatch = await bcrypt.compare(password, user.password);
//   if (!isMatch) return null;

//   // Generate tokens
//   const accessToken = generateAccessToken({ id: user._id, email: user.email, role: user.role });
//   const refreshToken = generateRefreshToken({ id: user._id, role: user.role });

//   return {
//     accessToken,
//     refreshToken,
//     admin: user,
//   };
// };

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



}
