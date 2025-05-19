import express from "express";
import { userController } from "../controllers/userController";
import { UserService } from "../services/Implements/userService";
import { UserRepositories } from "../repositories/Implements/UserRepositories";


const UserRepository = new UserRepositories();
const userServices = new UserService(UserRepository);
const userControllers = new userController(userServices);


const userRoutes = express.Router()

userRoutes.post('/signup', userControllers.register);

export default userRoutes

