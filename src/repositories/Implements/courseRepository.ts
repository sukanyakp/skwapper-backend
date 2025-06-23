import CourseModel from "../../models/admin/courseModel";
import User, { Iuser } from "../../models/user/userModel";
import { CourseData } from "../../types/course.types";
import { IcourseRepository } from "../Interfaces/IcourseRepository";
import { BaseRepository } from "./baseRepository";

export class CourseRepository extends BaseRepository<Iuser> implements IcourseRepository {
    
    constructor(){
        super(User)
    }

    
  public async saveCourse  (data: any) : Promise<CourseData | null> {
  const newCourse = new CourseModel(data);
  return await newCourse.save();
  };

   public async getAllCourses(): Promise<any> {
    return await CourseModel.find();
  }
}