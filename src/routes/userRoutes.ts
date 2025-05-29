import express, { NextFunction, Request, Response } from "express";
import { UserController } from "../controllers/implements/userController";
import { UserService } from "../services/Implements/userService";
import { UserRepository } from "../repositories/Implements/userRepository";
import User from "../models/user/userModel";


const userRepositoryInstance = new UserRepository( );
const userServices = new UserService(userRepositoryInstance);
const userControllers = new UserController(userServices);


const userRoutes = express.Router()


userRoutes.post('/signup',(req:Request, res:Response,next:NextFunction)=>(
    userControllers.register(req,res)
))
userRoutes.post('/verify-otp' , userControllers.verifyOTp);
userRoutes.post('/login',userControllers.login)

export default userRoutes

