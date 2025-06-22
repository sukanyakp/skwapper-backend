
import User, { Iuser } from "../../models/user/userModel";
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

}

export default AdminRepository