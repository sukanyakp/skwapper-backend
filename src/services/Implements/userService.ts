import { UserRepositories } from "../../repositories/Implements/UserRepositories";
import { IuserRepositories } from "../../repositories/Interfaces/IuserRepositories";
import { IuserService } from "../Interfaces/IuserService";

export class UserService implements IuserService {
      private userRepository: IuserRepositories;

      constructor(userRepository: UserRepositories) {
        this.userRepository = userRepository;
      }
}