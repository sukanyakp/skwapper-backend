import { BaseRepository } from "./baseRepository";
import { IAdminRepository } from "../Interfaces/IadminRepository";
import User, { Iuser } from "../../models/user/userModel";
import TutorApplicationModel from "../../models/tutor/tutorApplicationModel";
import type {Role} from "../../types/role.types"

export class AdminRepository extends BaseRepository<Iuser> implements IAdminRepository {
  constructor() {
    super(User);
  }

  async tutorBlockStatus(userId: string, block: boolean): Promise<Iuser | null> {
    return await TutorApplicationModel.findOneAndUpdate(
      { user: userId },
      { isBlocked: block },
      { new: true }
    );
  }

  async userBlockStatus(userId: string, block: boolean): Promise<Iuser | null> {
    return await User.findByIdAndUpdate(
      userId,
      { isBlocked: block },
      { new: true }
    );
  }

  async getAllUsers(): Promise<Iuser[]> {
    return await User.find({}, "-password");
  }

  async getAllTutorApplications(): Promise<any[]> {
    return await TutorApplicationModel.find().populate("user", "name email");
  }

  async getTutorApplicationById(applicationId: string): Promise<any | null> {
    return await TutorApplicationModel.findById(applicationId).populate("user", "name email");
  }

  async updateTutorApplicationStatus(
    applicationId: string,
    action: "approved" | "rejected",
    role: Role
  ): Promise<any> {
    const application = await TutorApplicationModel.findById(applicationId);
    if (!application) return null;

    const userId = application.user;
    const user = await User.findById(userId);

    if (!user) throw new Error("User not found");

    user.role = role;
    await user.save();

    application.status = action;
    await application.save();

    await User.findByIdAndUpdate(userId, {
      status: action,
      isApproved: action === "approved"
    });

    return application;
  }
}
