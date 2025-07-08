import { CourseController } from "../controllers/implements/courseController";
import { CourseRepository } from "../repositories/Implements/courseRepository";
import { CourseService } from "../services/Implements/courseService";
import express from "express";


const courseRepositoryInstance = new CourseRepository();
const courseServices = new CourseService(courseRepositoryInstance)
const courseController = new CourseController(courseServices)

const courseRoutes = express.Router()

courseRoutes.post("/",courseController.createNewCourse)
courseRoutes.get("/",courseController.getAllCourses)
courseRoutes.get("/:id",courseController.getCourseById)


export default courseRoutes