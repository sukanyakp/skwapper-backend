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
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;

      const result = await this.service.fetchAllCourses(page, limit);

      res.status(200).json(result); // contains: { courses, totalPages }
    } catch (err) {
      console.error("Error fetching courses:", err);
      res.status(500).json({ message: "Server error" });
    }
  };
    

 public getCourseById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      // if (!mongoose.Types.ObjectId.isValid(id)) {
      //   res.status(400).json({ message: "Invalid course ID" });
      //   return;
      // }

      const course = await this.service.getCourseById(id);

      console.log(course , 'courses');
      

      if (!course) {
        res.status(404).json({ message: "Course not found" });
        return;
      }

      res.status(200).json(course);
    } catch (err) {
      console.error("Error fetching course:", err);
      res.status(500).json({ message: "Server error" });
    }
  };

}