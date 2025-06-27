import express from 'express';
import { AdminController } from '../controllers/implements/adminController';
import { AdminRepository } from '../repositories/Implements/adminRepository';
import { AdminService } from '../services/Implements/adminService';
import { verifyToken } from '../middlewares/authMiddleware';
import { verifyRole } from '../middlewares/verifyRole';   

const adminRepositoryInstance = new AdminRepository();
const adminServices = new AdminService(adminRepositoryInstance);
const adminController = new AdminController(adminServices);

const adminRoutes = express.Router();                                                                                                           


const adminAuthMiddleware = [verifyToken, verifyRole('admin')];

adminRoutes.get(
  '/tutors',
  adminAuthMiddleware,
  adminController.getTutors
);

// adminRoutes.patch(
//   '/tutors/:id/:action',
//   verifyToken,
//   // adminAuthMiddleware,
//   adminController.
// );

adminRoutes.get(
  '/tutor-applications',
   verifyToken,
  // adminAuthMiddleware,
  adminController.getTutorApplications  // This is the one (admin/tutors)
);

adminRoutes.get(
  "/tutor-applications/:applicationId",
   verifyToken,
  // adminAuthMiddleware,
  adminController.getTutorApplicationById
)



adminRoutes.patch(
  '/tutor-applications/:applicationId/review',
   verifyToken,
  // adminAuthMiddleware,
  adminController.reviewTutorApplication
);



// routes/adminRoutes.ts
adminRoutes.patch(
  "/users/:userId/block-toggle", 
   verifyToken,
  // adminAuthMiddleware, 
  adminController.toggleBlockUser);

adminRoutes.get(
  "/users" ,
   verifyToken,
  // adminAuthMiddleware,
  adminController.getAllUsers)




export default adminRoutes;
