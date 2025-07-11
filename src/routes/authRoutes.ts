import express from "express";
import { AuthController } from "../controllers/implements/authController";
import { UserRepository } from "../repositories/Implements/userRepository";
import { AuthService } from "../services/Implements/authService";

const userRepositoryInstance = new UserRepository( );

const authServices = new AuthService(userRepositoryInstance)
const authController = new AuthController(authServices)


const authRoutes = express.Router();

authRoutes.post('/login',authController.login)
authRoutes.post('/signup', authController.register)
authRoutes.post('/verify-otp',authController.verifyOTp)
authRoutes.post('/resend-otp',authController.resendOtp)
authRoutes.post('/forgot-password' , authController.forgotPassword)

authRoutes.post("/reset-password/:token", authController.resetPassword);

authRoutes.get('/refresh-token',authController.refreshToken) // GET 


export default authRoutes