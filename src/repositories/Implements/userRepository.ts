import User,{Iuser} from "../../models/user/User";
import { IuserRepository } from "../Interfaces/IuserRepository";
import { BaseRepository } from "./baseRepository";

import { IBaseRepository } from "../Interfaces/IbaseRepository";


export class UserRepository extends BaseRepository<Iuser> implements IuserRepository {
  constructor() {
    super(User);
  }

  async createUser(userData: Iuser): Promise<Iuser> {
    return this.create(userData); // delegate to BaseRepository
  }
}