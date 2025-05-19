import User, { Iuser } from "../../models/User";
import { IuserRepositories } from "../Interfaces/IuserRepositories";
import { BaseRepository } from "./baseRepositories";

export class UserRepositories extends BaseRepository<Iuser> implements IuserRepositories {
    constructor(){
        super(User)
    }
}

