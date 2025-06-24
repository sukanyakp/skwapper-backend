import { Request, Response } from "express";
import { IcourseService } from "../../services/Interfaces/IcourseService";

export class CourseController {
    private service : IcourseService;

    constructor(service : IcourseService){
        this.service = service
    }


    
    public createNewCourse = async (req: Request, res: Response) : Promise<void>=> {
      try {
        const { category ,description } = req.body;
        console.log(category,description , 'create new course');
        
    
        if (!category || !description ) {
           res.status(400).json({ message: "Missing required fields" });
           return
        }
    
        const course = await this.service.createCourse({
          category,
          description
         
        });
    
        res.status(201).json({ message: "Course created successfully", course });
      } catch (error) {
        console.error("Create course error:", error);
        res.status(500).json({ message: "Server error while creating course" });
      }
    };

    public getAllCourses = async (req: Request, res: Response) => {
  try {

    console.log('getAllCourses');
    
    const courses = await this.service.fetchAllCourses();
    console.log(courses , 'courses');
    
    res.status(200).json(courses);
  } catch (err) {
    console.error("Error fetching courses:", err);
    res.status(500).json({ message: "Server error" });
  }
};
    


}