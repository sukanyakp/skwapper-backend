import express from "express";
import { UserController } from "../controllers/implements/userController";
import { UserService } from "../services/Implements/userService";
import { UserRepository } from "../repositories/Implements/userRepository";


const userRepositoryInstance = new UserRepository();
const userServices = new UserService(userRepositoryInstance);
const userControllers = new UserController(userServices);


const userRoutes = express.Router()

userRoutes.post('/signup', userControllers.register);

export default userRoutes

