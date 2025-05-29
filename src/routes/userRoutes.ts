import express, { NextFunction, Request, Response } from "express";
import { UserController } from "../controllers/implements/userController";
import { UserService } from "../services/Implements/userService";
import { UserRepository } from "../repositories/Implements/userRepository";
import User from "../models/user/userModel";
import { AuthController } from "../controllers/implements/authController";
import { AuthService } from "../services/Implements/authService";


const userRepositoryInstance = new UserRepository( );
const userServices = new UserService(userRepositoryInstance);
const userControllers = new UserController(userServices);

const authServices = new AuthService(userRepositoryInstance)
const authControllers = new AuthController(authServices)


const userRoutes = express.Router()


userRoutes.post('/signup',(req:Request, res:Response,next:NextFunction)=>(
    userControllers.register(req,res)
))
userRoutes.post('/verify-otp' , userControllers.verifyOTp);
userRoutes.post('/login',authControllers.login)

export default userRoutes

