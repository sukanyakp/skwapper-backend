
import CourseModel from "../../models/admin/courseModel";
import tutorApplicationModel from "../../models/tutor/tutorApplicationModel";
import User, { Iuser } from "../../models/user/userModel";
import { CourseData } from "../../services/Implements/adminService";
import { IAdminRepository } from "../Interfaces/IadminRepository";
import { BaseRepository } from "./baseRepository";


export class AdminRepository extends BaseRepository<Iuser>  implements IAdminRepository {
    constructor(){
        super(User)
    }

    async findByEmail(email: string): Promise<Iuser | null> {
        return User.findOne({ email });
      }


    async createAdmin(adminData: Iuser): Promise<Iuser> {
        try {
          return await this.create(adminData);
        } catch (error) {
          console.error("Error creating user", error);
          throw new Error("Error creating user");
        }
     }

     async findByRole(role : string) : Promise < Iuser[] > {
      return User.find({ role });
     }

    async findById(id: string): Promise<Iuser | null> {
          return await User.findById(id);
    }


     public async toggleBlockStatus(userId: string, block: boolean): Promise<Iuser | null> {
    return await tutorApplicationModel.findOneAndUpdate(
     { user : userId},
      { isBlocked: block },
      { new: true }
    );
  }


  public async saveCourse  (data: any) : Promise<CourseData | null> {
  const newCourse = new CourseModel(data);
  return await newCourse.save();
  };

   public async getAllCourses() {
    return await CourseModel.find();
  }

}

export default AdminRepository