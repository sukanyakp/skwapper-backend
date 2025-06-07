import express, { Request, Response } from "express";
import { TutorController } from "../controllers/implements/tutorController";
import { TutorService } from "../services/Implements/tutorService";
import { TutorRepository } from "../repositories/Implements/tutorRepository";
import  Tutor  from "../models/tutor/tutorModel";
import  User from "../models/user/userModel";
import multer from "multer";
import { verifyToken } from "../middlewares/authMiddleware";

const storage = multer.memoryStorage();
const upload = multer({ storage });

//  Pass model here
const tutorRepositoryInstance = new TutorRepository(User);
const tutorService = new TutorService(tutorRepositoryInstance);
const tutorControllers = new TutorController(tutorService);

const router = express.Router();

// POST /tutor/apply
router.post("/apply", upload.array("documents"), tutorControllers.apply);
router.get('/status', verifyToken, tutorControllers.checkStatus)

export default router;
