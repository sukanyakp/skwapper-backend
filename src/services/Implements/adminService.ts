import { IAdminService } from "../Interfaces/IadminService";
import { IAdminRepository } from "../../repositories/Interfaces/IadminRepository";
import { Iuser } from "../../models/user/userModel";
import { ITutorApplication } from "../../models/tutor/tutorApplicationModel";

export class AdminService implements IAdminService {
  private UserRepository: IAdminRepository;

  constructor(UserRepository: IAdminRepository) {
    this.UserRepository = UserRepository;
  }

  public async getTutors(): Promise<Iuser[]> {
    return this.UserRepository.findByRole("tutor");
  }

  public async getAllUsers(page: number, limit: number): Promise<{ users: Iuser[]; totalPages: number }> {
    const skip = (page - 1) * limit;
    const users = await this.UserRepository.getUsersPaginated(skip, limit);
    const total = await this.UserRepository.getUserCount();
    const totalPages = Math.ceil(total / limit);
    return { users, totalPages };
  }

 
public async getTutorApplications  (page: number, limit: number): Promise<any> {
  return await this.UserRepository.fetchTutorApplications(page, limit);
};

  public async getTutorApplicationById(applicationId: string): Promise<any | null> {
    return this.UserRepository.getTutorApplicationById(applicationId);
  }

  public async reviewTutorApplication(
    applicationId: string,
    action: "approved" | "rejected"
  ): Promise<any> {
    const role = action === "approved" ? "tutor" : "student";
    return await this.UserRepository.updateTutorApplicationStatus(applicationId, action, role);
  }

  public async toggleBlockUser(userId: string, block: boolean): Promise<Iuser | ITutorApplication | null> {
    const user = await this.UserRepository.findById(userId);
    if (!user) throw new Error("User not found");
    console.log(user.role ,'user.role');

    if (user.role === "tutor") {
      console.log('inside user.roel');
      
      const tutor = await this.UserRepository.tutorBlockStatus(userId, block);
      console.log(tutor , 'tutor');
      

       return tutor
    } else {
      return await this.UserRepository.userBlockStatus(userId, block);
    }
  }


}
