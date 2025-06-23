import User, { Iuser } from "../../models/user/userModel";
import { IcourseRepository } from "../Interfaces/IcourseRepository";
import { BaseRepository } from "./baseRepository";

export class CourseRepository extends BaseRepository<Iuser> implements IcourseRepository {
    constructor(){
        super(User)
    }
}