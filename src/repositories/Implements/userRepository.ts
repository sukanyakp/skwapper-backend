import User, { Iuser } from "../../models/user/userModel";
import { IuserRepository } from "../Interfaces/IuserRepository";
import { BaseRepository } from "./baseRepository";

export class UserRepository extends BaseRepository<Iuser> implements IuserRepository {
  constructor() {
    super(User);
  }

  async createUser(userData: Iuser): Promise<Iuser> {
    const value =  await this.create(userData);
    return value;
  }

  async findByEmail(email: string): Promise<Iuser | null> {
    return User.findOne({ email });
  }
}
