import express from 'express';
import { AdminController } from '../controllers/implements/adminController';
import { AdminRepository } from '../repositories/Implements/adminRepository';
import { AdminService } from '../services/Implements/adminService';
import { verifyToken } from '../middlewares/authMiddleware'; // ✅ Auth check
import { verifyRole } from '../middlewares/verifyRole';   // ✅ Role check

const adminRepositoryInstance = new AdminRepository();
const adminServices = new AdminService(adminRepositoryInstance);
const adminController = new AdminController(adminServices);

const adminRoutes = express.Router();                                                                                                           

// Public routes (no auth needed)
// adminRoutes.post('/register', adminController.register);
// adminRoutes.post('/login', adminController.login);

// ✅ Protected routes: verifyToken + verifyRole("admin")
adminRoutes.get(
  '/tutors',
  verifyToken,
  // verifyRole('admin'),
  adminController.getTutors
);

adminRoutes.patch(
  '/tutors/:id/:action',
  verifyToken,
  // verifyRole('admin'),
  adminController.updateTutorStatus
);

adminRoutes.get(
  '/tutor-applications',
  // verifyToken,
  // verifyRole('admin'),
  adminController.getTutorApplications
);

adminRoutes.get(
  "/tutor-applications/:applicationId",
  // verifyRole('admin')
  adminController.getTutorApplicationById
)



adminRoutes.patch(
  '/tutor-applications/:applicationId/review',
  // verifyToken,
  // verifyRole('admin'),
  adminController.reviewTutorApplication
);

export default adminRoutes;
