import CourseModel from "../../models/admin/courseModel";
import TutorialModel, { ITutorial } from "../../models/tutor/TutorialModel";
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

    public async getPaginatedCourses(page: number, limit: number) : Promise<any>{
    const skip = (page - 1) * limit;

    const [courses, totalCount] = await Promise.all([
      CourseModel.find().skip(skip).limit(limit).lean(),
      CourseModel.countDocuments()
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      courses,
      totalPages
    };
  }


   public async getCourseById(courseId: string): Promise<ITutorial | null> {
    return await TutorialModel.findById(courseId);
  }
}