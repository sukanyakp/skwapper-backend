import express, { NextFunction, Request, Response } from "express";
import { UserController } from "../controllers/implements/userController";
import { UserService } from "../services/Implements/userService";
import { UserRepository } from "../repositories/Implements/userRepository";
import { AuthController } from "../controllers/implements/authController";
import { AuthService } from "../services/Implements/authService";
import { verifyToken } from '../middlewares/authMiddleware'; // ✅ Auth check
// import upload from "../utils/cloudinaryConfig";
import multer from "multer";

const storage = multer.memoryStorage()
const upload = multer({storage})


const userRepositoryInstance = new UserRepository( );
const userServices = new UserService(userRepositoryInstance);
const userControllers = new UserController(userServices);

const authServices = new AuthService(userRepositoryInstance)
const authControllers = new AuthController(authServices)

const userRoutes = express.Router()


userRoutes.post('/login',authControllers.login)
userRoutes.post('/forgot-password' , authControllers.forgotPassword)

userRoutes.post("/reset-password/:token", authControllers.resetPassword);

userRoutes.post('/profile',verifyToken,upload.single("image"), userControllers.createProfile)
userRoutes.get('/profile',verifyToken ,userControllers.getStudentProfile)
userRoutes.get('/tutors', userControllers.getApprovedTutors)
userRoutes.get('/tutor/:tutorId' ,userControllers.getTutorById)
userRoutes.post('/tutor/request/:tutorId', verifyToken, userControllers.sendSessionRequest);

userRoutes.get('/recommended-courses' ,userControllers.getRecommendedCourses)

// userRoutes.get('/session-requests' , userControllers.getSessionRequests)



export default userRoutes

