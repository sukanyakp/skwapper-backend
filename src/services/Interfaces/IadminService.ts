import { Iuser } from "../../models/user/userModel";

export interface IAdminService {
    // register(name: string , email : string , password : string ): Promise<Iuser | null> 
    // login(email: string, password: string): Promise<{
    //       accessToken: string;
    //       refreshToken: string;
    //       admin: Iuser;
    //       } | null> 
    getTutorApplications(): Promise<any[]>;
    reviewTutorApplication(
    applicationId: string,
    action: "approved" | "rejected",
    // adminId: string,
    rejectionReason?: string
  ): Promise<any>
    getTutors(): Promise<Iuser[]>
    updateTutorStatus(id: string, action: string): Promise<Iuser | null> 
    getTutorApplicationById(applicationId: string): Promise<any | null>
    toggleBlockUser(userId: string, block: boolean) : Promise<any | null>
}