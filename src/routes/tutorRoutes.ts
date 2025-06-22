import express from "express";
import multer from "multer";
import { TutorController } from "../controllers/implements/tutorController";
import { TutorService } from "../services/Implements/tutorService";
import { TutorRepository } from "../repositories/Implements/tutorRepository";
import User from "../models/user/userModel";
import { verifyToken } from "../middlewares/authMiddleware";   // ✅ Auth middleware
// import upload from "../utils/cloudinaryConfig";


const storage = multer.memoryStorage();
const upload = multer({ storage });

const tutorRepositoryInstance = new TutorRepository(User);
const tutorService = new TutorService(tutorRepositoryInstance);
const tutorControllers = new TutorController(tutorService);

const router = express.Router();

// ✅ POST /tutor/apply (must be logged in as a user/tutor)
router.post(
  "/apply",
  verifyToken,                   // 🛡️ ensure user is authenticated
  upload.array("documents"),
  tutorControllers.apply
);

// ✅ GET /tutor/status (optional: protect based on auth or role)
router.get(
  "/status",
  verifyToken,                  // 🛡️ protect this if it's user-specific
  tutorControllers.checkStatus
);

router.get(
  "/apply-status",
  verifyToken,
  tutorControllers.checkTutorApplicationStatus
)



router.post('/profile',verifyToken,upload.single("image"), tutorControllers.createProfile)
router.get('/profile',verifyToken ,tutorControllers.getTutorProfile)


export default router;
