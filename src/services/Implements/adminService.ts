import { IAdminService } from "../Interfaces/IadminService";
import { IAdminRepository } from "../../repositories/Interfaces/IadminRepository";
import { Iuser } from "../../models/user/userModel";

export class AdminService implements IAdminService {
  private UserRepository: IAdminRepository;

  constructor(UserRepository: IAdminRepository) {
    this.UserRepository = UserRepository;
  }

  public async getTutors(): Promise<Iuser[]> {
    return this.UserRepository.findByRole("tutor");
  }

  public async getAllUsers(): Promise<Iuser[]> {
    return this.UserRepository.getAllUsers();
  }

  public async getTutorApplications(): Promise<any[]> {
    return this.UserRepository.getAllTutorApplications();
  }

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

  public async toggleBlockUser(userId: string, block: boolean): Promise<Iuser | null> {
    const user = await this.UserRepository.findById(userId);
    if (!user) throw new Error("User not found");

    if (user.role === "tutor") {
      return await this.UserRepository.tutorBlockStatus(userId, block);
    } else {
      return await this.UserRepository.userBlockStatus(userId, block);
    }
  }
}
